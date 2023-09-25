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
    echo "$pj_first_digits.$pj_middle_digits.$pj_last_digits"
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
  package_json_version_length=${#package_json_version}

  manifest_version=$(jq .version ./static/manifest.json)
  manifest_version_length=${#manifest_version}

  pj_first_digits=`expr match "$package_json_version" '"\([0-9]*\)\.'`
  pj_middle_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)\.'`
  pj_last_digits=`expr match "$package_json_version" '.*\.\([0-9]*\)'`

  m_first_digits=`expr match "$manifest_version" '"\([0-9]*\)\.'`
  m_middle_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)\.'`
  m_last_digits=`expr match "$manifest_version" '.*\.\([0-9]*\)'`

  package_json_version=$pj_first_digits.$pj_middle_digits.$pj_last_digits

  if [[ ! $pj_first_digits -eq $m_first_digits ]] || [[ ! $pj_middle_digits -eq $m_middle_digits ]] || [[ !  $pj_last_digits -eq $m_last_digits ]]; then
    echo "Error: package.json and static/manifest.json have mismatched versions"
    exit 1
  fi

  if [[ ! $CURRENT_VERSION == $package_json_version ]]; then
    echo "Error: branch $CURRENT_REF_NAME version is not equal to master. Master version = $CURRENT_VERSION --- $CURRENT_REF_NAME version = $package_json_version . Pull master to update. " 
    exit 1
  fi

  new_version_string="0.0.0"
  if [[ $update_level == "patch" ]]; then
    new_version_string="$pj_first_digits.$pj_middle_digits.$(($pj_last_digits+1))"
  elif [[ $update_level == "minor" ]]; then
    new_version_string="$pj_first_digits.$(($pj_middle_digits+1)).0"
  elif [[ $update_level == "major" ]]; then
    new_version_string="$(($pj_first_digits+1)).0.0"
  else
    new_version_string="$pj_first_digits.$pj_middle_digits.$(($pj_last_digits+1))"
  fi

  if [[ ! $DRY_RUN ]]; then
    npm version $update_level --no-git-tag-version

    # update manifest json
    jq ".version |= \"$new_version_string\"" ./static/manifest.json > ./static/manifest_tmp.json && mv ./static/manifest_tmp.json ./static/manifest.json
  fi
  return $new_version_string
}

$1 $2
