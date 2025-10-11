# UI Library Audit - @heroui/react Usage

## Audit Date: 2025-01-11

### Summary
Found **16 files** still importing from `@heroui/react` library. These need to be refactored to use shadcn/ui components.

---

## Files Using @heroui/react

### 1. **Core Application Files**
- `src/app/providers.tsx` - Uses `HeroUIProvider`
- `src/app/_auth-old/AuthClient.tsx` - Legacy auth component (can be removed)

### 2. **Page Components**
- `src/app/tracks/page.tsx` - Uses Card, CardBody, CardHeader, CardFooter, Button, Chip, Progress, Input, Select

### 3. **Atom Components**
- `src/components/atoms/CustomButton.tsx` - Uses Button, ButtonProps
- `src/components/atoms/CustomBadge.tsx` - Uses Chip, ChipProps
- `src/components/atoms/CustomAvatar.tsx` - Uses Avatar, AvatarProps
- `src/components/atoms/ProgressBar.tsx` - Uses Progress, ProgressProps
- `src/components/atoms/SearchBar.tsx` - Uses Input, Button, Kbd
- `src/components/atoms/Modal.tsx` - Uses Button
- `src/components/atoms/ProfileMenu.tsx` - Uses Avatar, Button, Divider, Badge
- `src/components/atoms/LoadingSkeleton.tsx` - Uses Card, CardBody, Skeleton

### 4. **Molecule Components**
- `src/components/molecules/Header.tsx` - Uses Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input
- `src/components/molecules/FloatingBottomNav.tsx` - Uses Button, Input, Avatar
- `src/components/molecules/LoginDropup.tsx` - Uses Button, Input, Card, CardHeader, CardBody, Divider, Link
- `src/components/molecules/CourseCard.tsx` - Uses Card, CardBody, CardFooter, CardHeader
- `src/components/molecules/AuthFeaturesPanel.tsx` - Uses Card, CardBody, Avatar

---

## Refactoring Priority

### High Priority (Core Components)
1. `CustomButton.tsx` - Replace with shadcn/ui Button
2. `FloatingBottomNav.tsx` - Replace with shadcn/ui components
3. `Header.tsx` - Replace with shadcn/ui navigation components
4. `providers.tsx` - Remove HeroUIProvider

### Medium Priority (Widely Used)
5. `CustomBadge.tsx` - Replace with shadcn/ui Badge
6. `CustomAvatar.tsx` - Replace with shadcn/ui Avatar
7. `Modal.tsx` - Replace with shadcn/ui Dialog
8. `SearchBar.tsx` - Replace with shadcn/ui Input

### Low Priority (Page-Specific)
9. `tracks/page.tsx` - Replace Hero UI components
10. `ProfileMenu.tsx` - Replace with shadcn/ui Dropdown
11. `LoginDropup.tsx` - Replace with shadcn/ui components
12. `CourseCard.tsx` - Already using shadcn/ui, minimal changes
13. `AuthFeaturesPanel.tsx` - Replace with shadcn/ui Card
14. `LoadingSkeleton.tsx` - Replace with shadcn/ui Skeleton
15. `ProgressBar.tsx` - Replace with shadcn/ui Progress

### Can Be Removed
16. `_auth-old/AuthClient.tsx` - Legacy component, safe to delete

---

## Replacement Mapping

| @heroui/react Component | shadcn/ui Replacement |
|------------------------|----------------------|
| Button | @/components/ui/button |
| Input | @/components/ui/input |
| Card, CardBody, CardHeader, CardFooter | @/components/ui/card |
| Avatar | @/components/ui/avatar |
| Badge | @/components/ui/badge |
| Progress | @/components/ui/progress |
| Chip | @/components/ui/badge |
| Select | @/components/ui/select |
| Dropdown | @/components/ui/dropdown-menu |
| Modal | @/components/ui/dialog |
| Skeleton | @/components/ui/skeleton |
| Divider | @/components/ui/separator |

---

## Next Steps

1. **Prompt 2**: Refactor CustomButton and FloatingBottomNav
2. **Prompt 3**: Refactor Header and navigation components
3. **Prompt 4**: Refactor remaining atom components
4. **Prompt 5**: Refactor page components and remove HeroUIProvider

---

## Notes

- Most shadcn/ui components are already available in `src/components/ui/`
- Some components like Navbar need custom implementation
- All refactored components should maintain existing functionality
- Apply new interactive styles (glow, shadow, glazing) during refactoring

