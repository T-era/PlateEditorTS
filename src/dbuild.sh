LIB_DIR=lib
TARGETS=("canvas_tools" "hover" "plates")

# Compile TypeScript code.
for fld in ${TARGETS[@]}; do
  tsc -d --out $LIB_DIR/$fld.d.ts ts/$fld/main.ts
done
