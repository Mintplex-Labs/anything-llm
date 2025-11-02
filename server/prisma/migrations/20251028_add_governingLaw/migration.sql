-- Migration: add governingLaw to purchase_orders
ALTER TABLE "purchase_orders" ADD COLUMN IF NOT EXISTS "governingLaw" text;
