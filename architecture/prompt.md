# TASK: Build a Production-Grade CMS Admin Panel + Refactor Repository to Feature-Based Architecture

You are working on the existing **Shiv Shakti Events Mart** production codebase.

The application is currently:

* Frontend: React 19 + TypeScript + Vite + React Router v7 + SCSS
* Backend: Node.js ES Modules + Express.js
* ORM: Prisma
* Database: PostgreSQL
* Authentication: JWT via HTTP-only cookie, with Bearer fallback
* External services: Cloudinary for media, Google OAuth
* Existing admin protection: `AdminRoute.tsx` on frontend + backend `authenticate` / `authorize('ADMIN')`
* Existing product CRUD and admin dashboard already exist
* Existing product catalog metadata is partially hardcoded in frontend constants
* Existing product fetching uses an in-memory 5-minute cache with explicit invalidation
* Existing frontend state uses React primitives and Outlet Context rather than Redux/Zustand

Use the existing architecture as the baseline. Do NOT create an unrelated second architecture.

---

# 1. PRIMARY OBJECTIVE

Build a complete **Content Management System (CMS) / Admin Management Platform** that allows an authorized administrator to manage the website without modifying source code.

The admin must be able to manage:

1. Category hierarchy
2. Subcategories
3. Sub-subcategories
4. SKU/product creation
5. SKU/product editing
6. SKU/product publishing
7. SKU/product unpublishing
8. SKU/product media/images
9. SKU/product metadata
10. Product filters
11. Product filter values/options
12. Product badges
13. Product-finder configuration
14. Website pages
15. Page publishing/unpublishing
16. Existing content updates
17. Catalog visibility and ordering
18. All related content required to render the public website dynamically

The long-term goal is:

> **The frontend website should become data-driven. An administrator should be able to change the catalog structure, product information, filtering configuration, badges, images, and pages without requiring a frontend code deployment.**

---

# 2. IMPORTANT: FIRST INSPECT THE EXISTING CODEBASE

Before modifying anything:

1. Inspect the complete frontend directory.
2. Inspect the complete backend directory.
3. Inspect `schema.prisma`.
4. Inspect existing:

   * AdminDashboard
   * AdminRoute
   * productController
   * productRoutes
   * authMiddleware
   * authController
   * existing `api.ts`
   * `useProducts.ts`
   * `categories.ts`
   * `mockData.ts`
   * MainLayout
   * HomePage
   * routing
   * Cloudinary integration
5. Identify which functionality already exists and reuse it.
6. Identify which existing frontend constants are currently responsible for category/filter/badge/catalog configuration.
7. Identify all hardcoded CMS-like content that should eventually become database-driven.

Do not blindly replace working functionality.

Before implementation, create an internal implementation map showing:

`Existing functionality -> Keep -> Refactor -> Extend -> Replace`

The implementation must preserve existing public functionality unless a change is explicitly required by this task.

---

# 3. CORE CMS MODULES

Create the following administrative modules.

## A. Category Management

Admin must be able to create and manage a three-level hierarchy:

```text
Category
   └── Subcategory
          └── Sub-subcategory
```

Example:

```text
Wedding
  ├── Mandaps
  │    ├── Traditional Mandaps
  │    ├── Royal Mandaps
  │    └── Modern Mandaps
  │
  ├── Tents
  │    ├── German Hangers
  │    └── Luxury Tents
  │
  └── Seating
       ├── Royal Chairs
       └── Sofa Seating
```

Admin functionality:

* Create category
* Edit category
* Archive/delete category where safe
* Publish/unpublish category if the architecture requires it
* Create subcategory
* Edit subcategory
* Create sub-subcategory
* Edit sub-subcategory
* Change ordering
* Change display name
* Change slug
* Upload category image
* Add description
* Enable/disable category
* View product count under category
* Prevent deletion when dependent products/content would become orphaned unless an explicit reassignment flow exists

Important:

Do NOT keep the authoritative category hierarchy only in:

```text
src/constants/categories.ts
```

The database must become the source of truth.

During migration, existing hardcoded categories should be seeded into the new database structure.

---

# 4. SKU / PRODUCT MANAGEMENT

The existing `Product` entity should be treated as the application's SKU/catalog entity unless inspection reveals that a separate SKU entity is necessary.

Admin needs:

### Create SKU

Form should support at minimum:

* SKU/code
* Product name
* Slug
* Category
* Subcategory
* Sub-subcategory
* Description
* Price
* Compare-at/original price if supported
* Rating if manually maintained
* Review count if applicable
* Stock/availability
* Product type
* Style
* Badge
* Featured flag
* Sort/display priority
* SEO title
* SEO description
* Search keywords
* Product specifications/features
* Status
* Product images/gallery

Use the existing product fields where appropriate and extend the schema where necessary.

Do not throw away the existing product model simply to make the CMS work.

---

# 5. SKU LIFECYCLE / PUBLISHING MODEL

Introduce a proper content lifecycle.

At minimum:

```text
DRAFT
PUBLISHED
UNPUBLISHED
```

Recommended lifecycle:

```text
DRAFT
  ↓
PUBLISHED
  ↓
UNPUBLISHED
  ↓
PUBLISHED
```

The admin should be able to:

* Save draft
* Publish
* Unpublish
* Edit published SKU
* Save changes without publishing
* Re-publish

Public APIs must only return products that are currently published and active.

Admin APIs must be able to retrieve:

* Draft products
* Published products
* Unpublished products

Never rely on frontend filtering alone to hide unpublished products.

The backend must enforce publication visibility.

---

# 6. SKU VALIDATION

Implement backend validation for:

* SKU uniqueness
* Slug uniqueness
* Required category hierarchy
* Valid price
* Valid status
* Valid image references
* Valid filter values
* Valid badge assignments

Duplicate SKU creation must return a clear API error.

Do not trust client-side validation as the security boundary.

---

# 7. PRODUCT IMAGE / MEDIA MANAGEMENT

The existing Cloudinary integration must be reused.

The admin must be able to:

* Upload product images
* Upload multiple images
* Set primary image
* Reorder images
* Replace image
* Remove image
* Add image alt text
* Preview image
* Store Cloudinary URL/public ID
* Associate images with a specific SKU
* Distinguish image roles where useful:

  * Thumbnail
  * Primary
  * Gallery
  * Detail image

Do not store uploaded binary image files directly in PostgreSQL.

Store Cloudinary metadata/reference in the database.

Recommended model:

```text
Product
   |
   └── ProductImage[]
          ├── url
          ├── publicId
          ├── altText
          ├── sortOrder
          ├── type
          └── createdAt
```

Existing products that currently have a single `image` field should be migrated carefully.

Avoid breaking existing image URLs during migration.

---

# 8. PRODUCT FILTER MANAGEMENT

Build a CMS for filters instead of hardcoding them in the frontend.

An admin must be able to create:

```text
Filter
   └── Filter Values
```

Examples:

```text
Style
   ├── Traditional
   ├── Modern
   └── Royal

Color
   ├── Gold
   ├── White
   └── Red

Material
   ├── Wood
   ├── Metal
   └── Fabric

Price Range
   ├── Under ₹50,000
   ├── ₹50,000–₹1,00,000
   └── Above ₹1,00,000
```

Each filter should support metadata such as:

* Name
* Label
* Key/slug
* Type
* Display order
* Active/inactive
* Applicable categories
* Filter values
* Value ordering

Support a reusable filter architecture instead of hardcoding:

```typescript
if (color === ...)
if (style === ...)
if (material === ...)
```

The frontend should obtain filter configuration from an API.

---

# 9. PRODUCT-FINDER FILTERS

Create a dedicated configuration system for the Product Finder page.

The admin should be able to decide:

* Which filters appear
* Which filters are active
* Filter order
* Which categories a filter applies to
* Which values belong to a filter
* Whether a filter allows:

  * single selection
  * multiple selection
  * range selection
* User-facing label
* Internal key
* Display ordering

Example:

```text
Product Finder
--------------------------------

Category
Style
Budget
Material
Color
Capacity
Availability
Featured
```

The website should not need code changes when the admin adds:

```text
"Seating Capacity"
```

as a new filter.

The new filter should automatically become available through the filter configuration API.

---

# 10. PRODUCT BADGES

Create a dedicated badge management system.

Examples:

```text
Bestseller
New Arrival
Featured
Royal Collection
Limited Edition
Popular
Editor's Choice
```

Admin must be able to:

* Create badge
* Edit badge
* Activate/deactivate badge
* Set display text
* Set identifier/slug
* Assign badge to products
* Remove badge from products
* Control ordering

Do not hardcode badge names in UI components.

The product should support zero, one, or multiple badges depending on the architecture.

Use a many-to-many relation if multiple badges per product are required.

---

# 11. WEBSITE PAGE MANAGEMENT

Create a CMS for website pages.

Admin must be able to:

* View pages
* Create page
* Edit page
* Save draft
* Publish page
* Unpublish page
* Archive page
* Set page slug
* Set title
* Set description
* Set SEO metadata
* Manage page visibility

Minimum lifecycle:

```text
DRAFT
PUBLISHED
UNPUBLISHED
```

The public website must not display unpublished pages.

Example pages could eventually include:

```text
About Us
Services
Wedding Collections
Corporate Events
Contact
Terms
Privacy
Custom Services
```

Do not assume all website pages are hardcoded React pages forever.

The architecture should support CMS-controlled content.

---

# 12. ADMIN INFORMATION ARCHITECTURE

The admin application should become a proper management cockpit.

Suggested navigation:

```text
ADMIN
│
├── Dashboard
│
├── Catalog
│   ├── Products / SKUs
│   ├── Categories
│   ├── Subcategories
│   ├── Sub-subcategories
│   ├── Filters
│   ├── Filter Values
│   └── Badges
│
├── Media
│   └── Product Images / Assets
│
├── Pages
│   ├── Published
│   ├── Drafts
│   └── Unpublished
│
├── Orders
│
├── Quotes
│
└── Settings
```

Do not create unnecessarily decorative UI.

This is an internal business application.

Prioritize:

* clarity
* speed
* consistency
* dense information presentation
* searchable tables
* bulk-friendly operations
* clear statuses
* predictable forms
* confirmation for destructive operations

---

# 13. PRODUCT LISTING ADMIN UI

The SKU management page should provide:

* Search
* SKU search
* Product name search
* Category filter
* Subcategory filter
* Status filter
* Badge filter
* Published/unpublished filter
* Pagination
* Sorting
* Bulk selection

Table should show approximately:

```text
┌────┬────────┬──────────────┬─────────────┬───────────┬──────────┬──────────┐
│    │ Image  │ SKU          │ Product     │ Category  │ Status   │ Actions  │
├────┼────────┼──────────────┼─────────────┼───────────┼──────────┼──────────┤
│ □  │ image  │ SKU-001      │ Royal Mandap│ Wedding   │ PUBLISHED│ Edit ... │
│ □  │ image  │ SKU-002      │ Gold Chair  │ Furniture │ DRAFT    │ Edit ... │
└────┴────────┴──────────────┴─────────────┴───────────┴──────────┴──────────┘
```

Actions:

* Edit
* Publish
* Unpublish
* Duplicate
* Delete/archive
* Preview

Use pagination from the backend.

Do NOT load the entire catalog into the admin browser if the API can paginate.

---

# 14. PRODUCT EDITOR

Prefer a structured editor instead of one enormous unorganized form.

Suggested sections:

```text
PRODUCT
├── Basic Information
├── SKU & URL
├── Category
├── Pricing
├── Description
├── Specifications
├── Images
├── Filters
├── Badges
├── Availability
├── SEO
└── Publishing
```

Use clear validation and unsaved-change protection.

Example publish area:

```text
Status: DRAFT

[Save Draft]     [Publish]
```

Published product:

```text
Status: PUBLISHED

[Save Changes]   [Unpublish]
```

---

# 15. CATEGORY ADMIN UI

Build a hierarchical category management screen.

Preferred structure:

```text
Categories
────────────────────────────────

Wedding
  ├─ Mandaps
  │    ├─ Traditional
  │    ├─ Royal
  │    └─ Modern
  │
  ├─ Tents
  │    └─ German Hangars
  │
  └─ Seating
       └─ Royal Seating

[+ Add Category]
[+ Add Subcategory]
[+ Add Sub-subcategory]
```

Admin should clearly understand parent/child relationships.

Do not build a confusing flat list for hierarchical data.

---

# 16. API ARCHITECTURE

Follow the existing REST architecture.

Create domain-specific API endpoints.

Suggested endpoints:

## Categories

```text
GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/categories/:id
PUT    /api/admin/categories/:id
PATCH  /api/admin/categories/:id/status
DELETE /api/admin/categories/:id
```

## Products / SKUs

```text
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PUT    /api/admin/products/:id
PATCH  /api/admin/products/:id/publish
PATCH  /api/admin/products/:id/unpublish
DELETE /api/admin/products/:id
```

## Product Images

```text
POST   /api/admin/products/:id/images
PUT    /api/admin/products/:id/images/:imageId
DELETE /api/admin/products/:id/images/:imageId
PATCH  /api/admin/products/:id/images/reorder
```

## Filters

```text
GET    /api/admin/filters
POST   /api/admin/filters
PUT    /api/admin/filters/:id
DELETE /api/admin/filters/:id
```

## Filter Values

```text
POST   /api/admin/filters/:id/values
PUT    /api/admin/filters/:id/values/:valueId
DELETE /api/admin/filters/:id/values/:valueId
```

## Badges

```text
GET    /api/admin/badges
POST   /api/admin/badges
PUT    /api/admin/badges/:id
DELETE /api/admin/badges/:id
```

## Pages

```text
GET    /api/admin/pages
POST   /api/admin/pages
GET    /api/admin/pages/:id
PUT    /api/admin/pages/:id
PATCH  /api/admin/pages/:id/publish
PATCH  /api/admin/pages/:id/unpublish
DELETE /api/admin/pages/:id
```

All CMS mutation endpoints must require:

```text
authenticate
+
authorize('ADMIN')
```

---

# 17. PUBLIC API BEHAVIOR

The CMS must integrate with the public website.

Public APIs should expose only appropriate published/active data.

For example:

```text
GET /api/products
```

should return only products that are:

```text
status = PUBLISHED
AND
active = true
```

unless the request is explicitly an authorized admin request.

Similarly:

```text
GET /api/categories
GET /api/filters
GET /api/pages
GET /api/badges
```

must return public/active configuration only.

The admin APIs may return drafts and unpublished content.

---

# 18. DATABASE MODELING

Inspect the existing Prisma schema before introducing new models.

The current application already has entities such as:

```text
User
Product
Order
OrderItem
Quote
Post
```

and product metadata is currently relatively flat.

Extend the database carefully.

A likely conceptual model is:

```text
Category
  id
  name
  slug
  description
  image
  parentId
  level
  sortOrder
  status
  createdAt
  updatedAt
```

This allows:

```text
Category
   ↓ parentId
Category
   ↓ parentId
Category
```

for three-level hierarchy.

Alternatively use explicit relations for Category/Subcategory/SubSubcategory if that is more appropriate after inspecting the existing system.

Products should support category relationships and publication lifecycle.

Conceptually:

```text
Product
ProductImage
Badge
ProductBadge
Filter
FilterValue
ProductFilterValue
Page
MediaAsset (only if justified)
```

Possible relationships:

```text
Product
 ├── ProductImage[]
 ├── ProductBadge[]
 └── ProductFilterValue[]

Filter
 └── FilterValue[]

Category
 └── Product[]

Page
```

Do not introduce redundant tables if an existing model can safely be extended.

---

# 19. IMPORTANT DATABASE DESIGN PRINCIPLE

Filters must not be encoded as a collection of fixed database columns such as:

```text
color
style
material
size
capacity
...
```

because the administrator must be able to create new filters.

Use a flexible attribute/facet relationship.

The architecture must support adding a new filter without a Prisma migration for every new filter value.

Example:

```text
Filter:
    name = "Material"

FilterValue:
    "Wood"
    "Metal"
    "Fabric"

ProductFilterValue:
    Product A -> Wood
    Product B -> Metal
```

This should be extensible.

---

# 20. PRODUCT JSON FEATURES

The current system already uses a JSON field for flexible product features. Preserve this capability where appropriate.

Do not unnecessarily normalize every free-form specification into a separate table.

Use structured relations for things that require:

* filtering
* sorting
* relationships
* administration

Use JSON for genuinely flexible descriptive specifications.

---

# 21. FRONTEND FEATURE-BASED REFACTOR

The existing frontend is currently organized primarily by technical type:

```text
components/
hooks/
layouts/
pages/
routes/
services/
styles/
constants/
```

Refactor toward a feature-first architecture.

Target direction:

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── routes/
│   └── providers/
│
├── features/
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── catalog/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── categories/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── filters/
│   ├── badges/
│   ├── pages-cms/
│   ├── media/
│   ├── cart/
│   ├── checkout/
│   ├── quotes/
│   ├── orders/
│   └── admin/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── api/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── styles/
│
└── main.tsx
```

This is a conceptual structure, not a command to copy blindly.

Use the actual business boundaries discovered while inspecting the code.

---

# 22. FEATURE OWNERSHIP RULE

A feature should contain the modules required specifically for that feature.

For example:

```text
features/products/
```

may contain:

```text
components/
    ProductTable.tsx
    ProductForm.tsx
    ProductImages.tsx
    ProductStatusBadge.tsx

hooks/
    useProducts.ts
    useProductMutation.ts

pages/
    ProductListPage.tsx
    ProductCreatePage.tsx
    ProductEditPage.tsx

services/
    productApi.ts

types/
    product.types.ts

validation/
    product.schema.ts
```

Do NOT place Product-specific components in global shared/components merely because another feature could theoretically import them.

The rule is:

> Put code with a clear business ownership inside the feature. Put code into `shared` only when it is genuinely feature-independent and reused across multiple features.

---

# 23. SHARED MODULE RULE

Create a `shared` layer for truly reusable infrastructure.

Examples:

```text
shared/components/
    Button
    Modal
    DataTable
    ConfirmDialog
    FormField
    ImageUploader

shared/hooks/
    useDebounce
    useToast

shared/api/
    httpClient

shared/utils/
    date
    formatting
    validation

shared/types/
    ApiResponse
    Pagination
```

Do NOT make `shared` a dumping ground.

Avoid:

```text
shared/products/
shared/categories/
shared/adminProducts/
shared/productFilters/
```

Business-domain logic belongs to its feature.

---

# 24. BACKEND FEATURE-BASED REFACTOR

Refactor the current backend structure from:

```text
controllers/
middlewares/
routes/
config/
```

toward domain ownership.

Target direction:

```text
src/
│
├── app/
│   ├── server.js
│   └── routes.js
│
├── features/
│   │
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.repository.js
│   │   ├── auth.routes.js
│   │   ├── auth.validation.js
│   │   └── auth.mapper.js
│   │
│   ├── products/
│   │   ├── product.controller.js
│   │   ├── product.service.js
│   │   ├── product.repository.js
│   │   ├── product.routes.js
│   │   ├── product.validation.js
│   │   └── product.mapper.js
│   │
│   ├── categories/
│   ├── filters/
│   ├── badges/
│   ├── pages/
│   ├── media/
│   ├── orders/
│   ├── quotes/
│   ├── search/
│   └── admin/
│
└── shared/
    ├── config/
    ├── db/
    ├── middleware/
    ├── auth/
    ├── errors/
    ├── utils/
    └── services/
```

The exact naming can follow existing project conventions, but the principle is mandatory:

> A domain feature should own its routes, controller, business logic, validation, repository/data access, types, and feature-specific utilities.

---

# 25. SERVICE / REPOSITORY SEPARATION

Do not put all business logic directly in Express controllers.

Prefer:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository / Prisma
```

Example:

```text
POST /api/admin/products

product.routes.js
        ↓
product.controller.js
        ↓
product.service.js
        ↓
product.repository.js
        ↓
Prisma
        ↓
PostgreSQL
```

Controllers should primarily handle:

* HTTP request
* parameter extraction
* invoking service
* HTTP response

Services should contain business rules.

Repositories should handle persistence/query logic where useful.

Do not create pointless abstraction layers for trivial functions; use judgment.

---

# 26. AUTHORIZATION

Reuse the current JWT authentication architecture.

The existing system supports:

* HTTP-only JWT cookie
* Bearer fallback
* `authenticate`
* `optionalAuth`
* `authorize('ADMIN')`

Preserve this architecture.

All CMS mutation endpoints must be protected server-side.

Frontend route protection is NOT sufficient.

---

# 27. ADMIN ROUTING

Preserve:

```text
/admin
```

but move toward:

```text
/admin
/admin/products
/admin/products/new
/admin/products/:id/edit

/admin/categories
/admin/filters
/admin/badges
/admin/pages
/admin/media
/admin/orders
/admin/quotes
```

Use nested routing where it improves maintainability.

Do not make every admin screen a giant conditional inside `AdminDashboard.tsx`.

Refactor the existing monolithic admin dashboard into feature-owned screens/components.

---

# 28. API CLIENT REFACTOR

The current frontend has:

```text
src/services/api.ts
```

which wraps native fetch.

Refactor this so that:

```text
shared/api/httpClient.ts
```

contains generic HTTP functionality.

Then domain-specific APIs live inside features:

```text
features/products/services/productApi.ts
features/categories/services/categoryApi.ts
features/filters/services/filterApi.ts
features/pages-cms/services/pageApi.ts
features/badges/services/badgeApi.ts
```

Do not create a single giant API file containing every endpoint.

---

# 29. CACHE INVALIDATION

The existing frontend product cache has a 5-minute TTL and an explicit invalidation mechanism.

Preserve and improve this behavior.

Whenever an admin:

* creates product
* updates product
* publishes product
* unpublishes product
* changes category assignment
* changes filters
* changes badges

the relevant frontend cache must be invalidated/refreshed.

At minimum:

```text
Product mutation
    ↓
invalidateProductCache()
    ↓
fresh product fetch
```

Do not leave the website showing stale catalog data after an admin mutation.

For categories, filters, badges and pages, design equivalent invalidation/refetch behavior.

---

# 30. REMOVE CMS HARD-CODING

As part of the implementation, identify frontend code where the website currently depends on hardcoded:

* categories
* subcategories
* filter names
* filter values
* badges
* product metadata
* page visibility
* catalog configuration

Move authoritative CMS-managed values to API/database-driven data.

Existing:

```text
mockData.ts
categories.ts
```

may remain temporarily for:

* development fixtures
* migration seed data
* tests

but must NOT remain the production source of truth for CMS-controlled content.

---

# 31. MIGRATION STRATEGY

This project already contains an active catalog and existing database.

Do not implement this as a destructive rewrite.

Create a safe migration plan:

### Step 1

Introduce new Prisma models/fields.

### Step 2

Create migration.

### Step 3

Seed/migrate existing category definitions.

### Step 4

Migrate existing products to category relationships.

### Step 5

Migrate existing product image fields into the new image model if needed.

### Step 6

Migrate existing product metadata into filter/badge structures where applicable.

### Step 7

Update APIs.

### Step 8

Update frontend.

### Step 9

Remove old production dependencies on hardcoded catalog configuration.

Do not delete old data before confirming successful migration.

---

# 32. SEED DATA

Create/update seed scripts so a fresh developer environment can be created from scratch.

Seed:

* Admin user where existing convention allows
* Existing categories
* Existing subcategories
* Existing sub-subcategories
* Existing products
* Existing filter definitions
* Existing filter values
* Existing badges
* Existing pages

Do not duplicate products during repeated seed runs.

Use idempotent seeding where practical.

---

# 33. PAGE CMS DESIGN

Do not over-engineer page-building functionality in the first implementation.

The first CMS version should focus on structured page content such as:

```text
Page
├── Title
├── Slug
├── Status
├── Content
├── Hero Image
├── SEO Title
├── SEO Description
└── Published At
```

Do not build a full drag-and-drop page builder unless the existing product requirements explicitly need one.

The goal is a maintainable CMS foundation.

---

# 34. ADMIN UX REQUIREMENTS

The admin UI should be functional and professional, not decorative.

Use:

* clear hierarchy
* consistent spacing
* reusable tables
* reusable forms
* status indicators
* confirmation dialogs
* inline validation
* loading states
* empty states
* error states
* success notifications
* pagination
* search
* filters

Every API mutation should provide visible success/failure feedback.

Destructive actions must require confirmation.

Example:

```text
Unpublish Product?

This product will no longer be visible on the public website.

[Cancel] [Unpublish]
```

---

# 35. RESPONSIVENESS

The admin application does not need to mimic the luxury storefront.

Optimize it for business operations.

Desktop should be the primary target.

Tablet support should be reasonable.

Do not spend time on highly decorative animations.

---

# 36. ERROR HANDLING

Use the existing centralized backend error-handler architecture.

All new APIs must return consistent responses.

Example success:

```json
{
  "success": true,
  "data": {}
}
```

Example failure:

```json
{
  "success": false,
  "message": "SKU already exists"
}
```

Do not expose internal stack traces in production.

---

# 37. AUDITABILITY

Where practical, structure mutation responses and database fields so future audit logging can be added.

Strongly consider storing:

```text
createdAt
updatedAt
publishedAt
unpublishedAt
```

for CMS-managed entities.

Do not add a complete audit-log subsystem unless it is justified by the existing requirements, but do not design the schema in a way that makes auditing impossible later.

---

# 38. PERFORMANCE REQUIREMENTS

Do not regress public-site performance.

Admin APIs must support pagination.

Product finder APIs must support efficient filtering.

Database indexes should be added for frequently queried fields such as:

* SKU
* slug
* status
* category IDs
* filter values
* published status
* createdAt

Review Prisma query patterns for N+1 problems.

Do not retrieve entire datasets when only summary/count information is required.

---

# 39. SECURITY REQUIREMENTS

Never trust:

* frontend role checks
* frontend status values
* frontend category IDs
* frontend product ownership
* frontend publication state

Backend must validate everything.

Protect all admin mutation endpoints.

Validate uploaded files.

Do not expose Cloudinary secrets to the browser.

Continue using server-side Cloudinary credentials.

The existing environment configuration should remain server-side.

---

# 40. TESTING

Add or update tests for the most important business rules.

At minimum test:

### Categories

* create category
* create child category
* duplicate slug
* invalid hierarchy
* deletion with dependent products

### Products

* create SKU
* duplicate SKU
* update SKU
* publish SKU
* unpublish SKU
* public API excludes unpublished SKU

### Filters

* create filter
* create filter value
* assign filter to product
* filter product results

### Badges

* create badge
* assign badge
* remove badge

### Pages

* create page
* publish page
* unpublish page
* public API excludes unpublished page

### Authorization

* normal user cannot access CMS mutations
* unauthenticated user cannot access CMS mutations

---

# 41. ACCEPTANCE CRITERIA

The work is complete only when all of the following are true.

## CMS

An administrator can manage:

```text
Categories
Subcategories
Sub-subcategories

SKUs
SKU data
SKU images
SKU status
SKU publishing
SKU unpublishing

Filters
Filter values
Product filter assignments

Badges
Badge assignments

Pages
Page content
Page publishing
Page unpublishing
```

## Architecture

Frontend is feature-oriented.

Backend is feature-oriented.

Shared code is isolated in `shared`.

No business-domain code is unnecessarily placed in shared.

The existing authentication/security model remains intact.

## Database

PostgreSQL remains the primary database.

Prisma remains the ORM.

Migration is non-destructive.

Existing catalog data remains usable.

## Public site

The public catalog works from database/API data.

Unpublished SKUs are not visible publicly.

Unpublished pages are not visible publicly.

Admin changes are reflected without source-code edits.

## Developer experience

A developer can identify all code belonging to a feature by opening one feature folder.

Example:

```text
features/products/
```

should contain the majority of product-specific frontend logic.

Similarly:

```text
features/products/
```

on the backend should contain the majority of product-specific backend logic.

---

# 42. IMPORTANT REFACTORING RULES

Do NOT:

* rewrite the entire application unnecessarily
* introduce Redux just for this task
* introduce a second state-management system without justification
* create giant generic utilities
* create giant generic components
* create duplicate API clients
* keep multiple competing sources of truth
* hardcode new categories into React
* hardcode new filters into React
* hardcode new badges into React
* bypass backend authorization
* expose Cloudinary credentials
* make the AdminDashboard a 2,000-line component
* put all CMS functionality into one controller
* put all frontend CMS functionality into one feature
* break current public routes without a migration reason

Prefer incremental refactoring over a rewrite.

---

# 43. IMPLEMENTATION ORDER

Implement in approximately this order:

```text
PHASE 1
Repository analysis
+
architecture map
+
database design

PHASE 2
Feature-based backend refactor

PHASE 3
Prisma schema changes
+
migrations
+
seed/migration scripts

PHASE 4
Category management

PHASE 5
Product/SKU management

PHASE 6
Cloudinary image management

PHASE 7
Filters + filter values

PHASE 8
Badges

PHASE 9
Page CMS

PHASE 10
Feature-based frontend refactor

PHASE 11
Admin routing and admin UI

PHASE 12
Public website integration

PHASE 13
Cache invalidation

PHASE 14
Testing + regression testing

PHASE 15
Cleanup of obsolete hardcoded CMS data
```

Do not attempt to hide the migration complexity by leaving two systems permanently active.

---

# 44. FINAL DELIVERABLE EXPECTATION

At the end, provide:

## Architecture

A concise explanation of the final architecture.

## Frontend structure

Show the final directory tree.

## Backend structure

Show the final directory tree.

## Database

Show the new/modified Prisma models and relationships.

## APIs

Show the complete CMS endpoint matrix.

## Migration

Explain how existing products/categories/images were migrated.

## Admin features

List what the administrator can now manage.

## Public integration

Explain how the public website consumes CMS-managed data.

## Removed hardcoding

List which existing frontend constants/mock data are no longer authoritative.

## Testing

List the tests added and important scenarios verified.

---

# 45. DEFINITION OF SUCCESS

The final system should behave conceptually like this:

```text
                    ADMIN
                      │
                      ▼
              ADMIN CMS UI
                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼
   Catalog         Content          Configuration
      │               │                │
      ├─ Products     ├─ Pages         ├─ Filters
      ├─ Categories   └─ Publishing    ├─ Values
      ├─ Images                        └─ Badges
      └─ SKUs
                      │
                      ▼
                REST API / Services
                      │
                      ▼
                   Prisma
                      │
                      ▼
                PostgreSQL
                      │
            ┌─────────┴──────────┐
            ▼                    ▼
        Public APIs          Cloudinary
            │                    │
            ▼                    ▼
      React Storefront       Product Media
```

The ultimate requirement is:

> **The admin should be able to manage the business/catalog/content layer of Shiv Shakti Events Mart without needing a developer to modify React constants, product mock data, category definitions, filter definitions, badge definitions, or page visibility in source code.**

Build this as an evolution of the existing application, not as a parallel CMS application.
