if [ -z "$1" ]; then 
    echo "Usage ./generate-documentation <PATH-TO-JSDOC-TOOLKIT>"
    exit 0
fi

DOC="$(realpath $(dirname $0))/doc";
FILES="$(realpath $(dirname $0))/jquery-seq.js";
cd "$1" && ./jsrun.sh -v -t=templates/jsdoc/  "$FILES" -d="$DOC"
