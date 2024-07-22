#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is required but not installed. Please install jq to proceed."
    exit 1
fi

# Function to replace placeholders in the template
generate_yaml() {
    local network=$1
    local config_file="config.json"
    local template_file="subgraph.template.yaml"
    local output_file="subgraph.${network}.yaml"

    # Read values from config.json
    local start_block=$(jq -r ".${network}.START_BLOCK" ${config_file})
    local voucherHub_address=$(jq -r ".${network}.VOUCHER_HUB_ADDRESS" ${config_file})

    # Replace placeholders in the template and create the output file
    sed -e "s/#NETWORK_NAME#/network: ${network}/g" \
        -e "s/#START_BLOCK#/startBlock: ${start_block}/g" \
        -e "s|#VOUCHER_HUB_ADDRESS#|address: \"${voucherHub_address}\"|g" \
        ${template_file} > ${output_file}

    echo "Generated ${output_file}"
}



network_name=${1:-localhost}

# Generate the YAML file for the specified network
generate_yaml ${network_name}
