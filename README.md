# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


#!/bin/bash

# Declare variables
declare -a GITLAB_API_VERSIONS
declare DEPLOYED_APP_VERSIONS_IN_PCF
declare PCF_API_URL
declare PCF_USER_NAME
declare PCF_USER_PWD
declare PCF_ENV
declare PCF_ORG

# Function to set PCF login parameters
setPcfLoginParams () {
  SRC_ENV=$1
  case "$SRC_ENV" in
    "development" | "developmentA" | "qa" | "custperf" | "cat")
      PCF_ORG="USA.MRCH.APP.OCOM"
      if [ "$SRC_ENV" == "cat" ] || [ "$SRC_ENV" == "custperf" ]; then
        PCF_ORG="USA.MRCH.APP.OCOM.CAT"
      fi
      PCF_USER_NAME="svc-devopsecomm"
      PCF_USER_PWD=$(secrets getValue "svc-devopsecomm")
      PCF_API_URL="https://api.system.us-$(infra.name)1-np2.1dc.com"
      ;;
    "prod" | "cert")
      PCF_ORG="USA.MRCH.APP.OCOM"
      PCF_USER_NAME="svc-devopsecommprod"
      PCF_USER_PWD=$(secrets getValue "svc-devopsecommprod-escaped")
      PCF_API_URL="https://api.system.us-$(infra.name)1-ip01.1dc.com"
      ;;
  esac
}

# Function to get application name
getApplicationName () {
  SERVICE_NAME=$1
  FORMATTED_SERVICE_NAME=$(echo "$SERVICE_NAME" | sed -r 's/[-]+/ /g')
  APPLICATION_NAME=$(cf apps | grep -E "^${FORMATTED_SERVICE_NAME}$" | grep started | awk '{print $1}' | sort -r | head -n 1)
  if [ -z "$APPLICATION_NAME" ]; then
    APPLICATION_NAME=$(cf apps | grep -E "^${SERVICE_NAME}$" | grep started | awk '{print $1}' | sort -r | head -n 1)
  fi
  echo "$APPLICATION_NAME"
}

# Function to get deployed app versions in PCF
getDeployedAppVersionsInPCF () {
  declare -i RETRY_COUNT=0
  MAX_RETRIES=3
  echo "Retrieving all apps in PCF..."
  cf apps | grep "commercehub" | grep started | awk '{print $1}' > cf_all_apps.txt
  DEPLOYED_APP_VERSIONS_IN_PCF="("

  for service in "${GITLAB_API_VERSIONS[@]}"; do
    SERVICE_NAME=$(getApplicationName "$service" cf_all_apps.txt)
    echo "SERVICE_NAME = $SERVICE_NAME"
    if [ ! -z "$SERVICE_NAME" ]; then
      VERSION=$(cf env "$SERVICE_NAME" | grep FDC_VERSION | awk '{print $2}')
      echo "VERSION = $VERSION"
      while [ -z "$VERSION" ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
        VERSION=$(cf env "$SERVICE_NAME" | grep FDC_VERSION | awk '{print $2}')
        RETRY_COUNT=$((RETRY_COUNT + 1))
      done
      if [ ! -z "$VERSION" ]; then
        DEPLOYED_APP_VERSIONS_IN_PCF+="$service=\"$VERSION\" "
      else
        DEPLOYED_APP_VERSIONS_IN_PCF+="$service=\"0\" "
      fi
    fi
  done
  DEPLOYED_APP_VERSIONS_IN_PCF+=")"
  echo "$DEPLOYED_APP_VERSIONS_IN_PCF"

  # Retrieve versions from the upper environment
  echo "Retrieve versions from upper env...$PCF_ENV"
  setPcfLoginParams "$PCF_ENV"
  cf login -a "$PCF_API_URL" -u "$PCF_USER_NAME" -p "$PCF_USER_PWD" -o "$PCF_ORG"
  getDeployedAppVersionsInPCF
  cf logout
  export DEPLOYED_APP_VERSIONS_IN_PCF
}

# Main logic
# Here you can add calls to your functions or additional logic as required
