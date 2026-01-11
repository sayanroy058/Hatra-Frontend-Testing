# iPhone Layout Fix - Dashboard Daily Reward & Level Sections

## Issue Description
On iPhone devices, the Dashboard page had layout issues where button text was being cut off (e.g., "Scratch Now" showing as "Sc") due to text overflow in flex containers.

## Root Cause
The flex layout used `justify-between` without proper overflow handling, causing the button to shrink and cut off its text when the left content was too wide for small screens (iPhone width ~375-430px).

## Files Modified
- `/src/pages/Dashboard.tsx` - Fixed three sections with overflow issues
- `/src/components/SpinWheel.tsx` - Previously fixed canvas issues (unrelated to this specific issue)

## Fixes Applied

### 1. Daily Reward Section (Lines 260-278)
**Before:**
- Container: `flex items-center justify-between`
- Text div: `<div>` (no overflow handling)
- Button: No shrink protection

**After:**
- Container: `flex items-center justify-between gap-3`
- Text div: `min-w-0 flex-1` with `truncate` on text elements
- Button: `flex-shrink-0 whitespace-nowrap`

```tsx
<div className="... flex items-center justify-between gap-3">
  <div className="min-w-0 flex-1">
    <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">...</h3>
    <p className="text-xs sm:text-sm text-muted-foreground truncate">...</p>
  </div>
  <Button className="flex-shrink-0 whitespace-nowrap">...</Button>
</div>
```

### 2. Level Rewards Section Header (Lines 282-308)

**After:**
- Added `flex-wrap` to allow wrapping on very small screens
- Added `min-w-0` and `truncate` to text container
- Added `flex-shrink-0` to button group

### 3. Level Items (Lines 362-399)

**After:**
- Added `gap-3` to prevent items from touching
- Added `min-w-0` to content container
- Added `flex-wrap` to level/badge row
- Added `truncate` to rank and reward text
- Added `flex-shrink-0 whitespace-nowrap` to View Details button

## Key CSS Classes Used

| Class | Purpose |
|-------|---------|
| `flex-shrink-0` | Prevents element from shrinking |
| `whitespace-nowrap` | Prevents text from wrapping to next line |
| `min-w-0` | Allows text truncation in flex children |
| `truncate` | Truncates text with ellipsis |
| `flex-wrap` | Allows items to wrap to next line |
| `gap-3` | Adds consistent spacing between items |

## Why These Fixes Work

1. **`min-w-0` on text containers**: By default, flex children have `min-width: auto` which prevents them from shrinking below their content. `min-w-0` overrides this, allowing truncation.

2. **`flex-shrink-0` on buttons**: Ensures buttons maintain their full size and never shrink.

3. **`whitespace-nowrap` on buttons**: Prevents button text from wrapping, keeping it on one line.

4. **`truncate` on text**: Adds `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to gracefully handle overflow with "..." instead of cutting off.

5. **`gap-3`**: Ensures there's always space between elements, preventing them from overlapping.

## Testing Checklist

- [ ] iPhone SE/Mini (375px width) - All buttons visible
- [ ] iPhone 14/15 (390-430px width) - All buttons visible  
- [ ] "Scratch Now" / "Claimed" button fully visible
- [ ] "View All" button fully visible
- [ ] "View Details" button fully visible
- [ ] Long text gracefully truncates with "..."
- [ ] No horizontal scrolling on page

## Before & After

**Before (iPhone):**
- "Scratch Now" → "Sc" (cut off)
- Buttons overlapping text
- Layout breaking

**After (iPhone):**
- "Scratch Now" → "Scratch Now" ✓
- Text truncates gracefully with "..."
- Layout maintains proper spacing
