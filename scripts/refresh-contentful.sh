#/bin/bash
set -e
contentful space export --space-id cvlcgjxo5px5 --include-drafts --content-file contentful-export.json 
contentful space import --space-id 22z2e1agxwc2 --content-file contentful-export.json 
