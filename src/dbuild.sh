LIB_DIR=lib
TARGETS=("tools" "hover" "plates" "scroll")

# Compile TypeScript code.
for fld in ${TARGETS[@]}; do
  tsc -d --out $LIB_DIR/$fld ts/$fld/main.ts
done
