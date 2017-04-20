DEST_DIR=../dest
TARGETS=("tools" "hover" "plates" "scroll" "test")

# Prepare TypeScript d files.
./dbuild.sh

# Compile TypeScript code.
for fld in ${TARGETS[@]}; do
  tsc --out $DEST_DIR/$fld.js ts/$fld/main.ts
done

# Copy static files.
cp static/* $DEST_DIR/

# Convert slim files to html.
for nm in slim/*.slim; do
  export fn=${nm#slim}
  slimrb -p $nm > $DEST_DIR/${fn%.slim}.html
done
