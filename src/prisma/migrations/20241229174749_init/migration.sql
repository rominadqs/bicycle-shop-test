-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(50),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_characteristics" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "products_characteristics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characteristics_options" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "is_in_stock" BOOLEAN NOT NULL DEFAULT true,
    "characteristic_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "characteristics_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_rules" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "restricted_characteristic_id" INTEGER NOT NULL,
    "restricted_option_id" INTEGER NOT NULL,
    "depends_on_characteristic_id" INTEGER NOT NULL,
    "depends_on_option_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "products_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products_characteristics" ADD CONSTRAINT "products_characteristics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristics_options" ADD CONSTRAINT "characteristics_options_characteristic_id_fkey" FOREIGN KEY ("characteristic_id") REFERENCES "products_characteristics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_rules" ADD CONSTRAINT "products_rules_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_rules" ADD CONSTRAINT "products_rules_restricted_characteristic_id_fkey" FOREIGN KEY ("restricted_characteristic_id") REFERENCES "products_characteristics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_rules" ADD CONSTRAINT "products_rules_depends_on_characteristic_id_fkey" FOREIGN KEY ("depends_on_characteristic_id") REFERENCES "products_characteristics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_rules" ADD CONSTRAINT "products_rules_restricted_option_id_fkey" FOREIGN KEY ("restricted_option_id") REFERENCES "characteristics_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_rules" ADD CONSTRAINT "products_rules_depends_on_option_id_fkey" FOREIGN KEY ("depends_on_option_id") REFERENCES "characteristics_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
