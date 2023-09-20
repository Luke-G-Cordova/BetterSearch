#!/bin/bash


function set_current_version(){
  # get current version string and its length
  package_json_version=$( jq .version package.json )
  package_json_version_length=${#package_json_version}

  manifest_version=$(jq .version ./static/manifest.json)
  manifest_version_length=${#manifest_version}

  pj_first_digits=`expr match "$package_json_version" '"\([0-9]*\)\.'`
  pj_middle_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)\.'`
  pj_last_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)'`

  m_first_digits=`expr match "$manifest_version" '"\([0-9]*\)\.'`
  m_middle_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)\.'`
  m_last_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)'`

  if [[ $pj_first_digits -eq $m_first_digits ]] && [[ $pj_middle_digits -eq $m_middle_digits ]] && [[ $pj_last_digits -eq $m_last_digits ]]; then
    export CURRENT_VERSION=$pj_first_digits.$pj_middle_digits.$pj_last_digits
    echo $CURRENT_VERSION
  else
    echo "Error: package.json and static/manifest.json have mismatched versions"
    exit 1
  fi
}

function update(){
  # get the argument
  update_level=$1

  # get current version string and its length
  package_json_version=$( jq .version package.json )
  if [[ ! $package_json_version -eq $CURRENT_VERSION ]]; then
    echo "Error: branch $CURRENT_REF_NAME version is not equal to master. Master version = $CURRENT_VERSION --- $CURRENT_REF_NAME version = $package_json_version . Pull master to update." 
    exit 1
  fi
  package_json_version_length=${#package_json_version}

  manifest_version=$(jq .version ./static/manifest.json)
  manifest_version_length=${#manifest_version}

  pj_first_digits=`expr match "$package_json_version" '"\([0-9]*\)\.'`
  pj_middle_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)\.'`
  pj_last_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)'`

  m_first_digits=`expr match "$manifest_version" '"\([0-9]*\)\.'`
  m_middle_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)\.'`
  m_last_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)'`

  if [[ ! $pj_first_digits -eq $m_first_digits ]] || [[ ! $pj_middle_digits -eq $m_middle_digits ]] || [[ !  $pj_last_digits -eq $m_last_digits ]]; then
    echo "Error: package.json and static/manifest.json have mismatched versions"
    exit 1
  fi

  # 0 for patch update, 1 for minor update, 2 for major update
  if [[ $update_level == 0 ]]; then
    new_version_string="$pj_first_digits.$pj_middle_digits.$(($pj_last_digits+1))"
    npm version patch --no-git-tag-version
  elif [[ $update_level == 1 ]]; then
    new_version_string="$pj_first_digits.$(($pj_middle_digits+1)).0"
    npm version minor --no-git-tag-version
  elif [[ $update_level == 2 ]]; then
    new_version_string="$(($pj_first_digits+1)).0.0"
    npm version major --no-git-tag-version
  else
    echo "Error: argument should be one of 0 for patch update, 1 for minor update, 2 for major update"
    exit 1;
  fi

  # update manifest json
  jq ".version |= \"$new_version_string\"" ./static/manifest.json > ./static/manifest_tmp.json && mv ./static/manifest_tmp.json ./static/manifest.json

  # git add package-lock.json package.json static/manifest.json
  # git commit -m "version update to $new_version_string"
  # git push
}

$1 $2
