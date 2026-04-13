# Style Guide — JoyB.VN

---

## 1. Triết lý thiết kế

**Modern · Minimal · Cinematic**

Giao diện JoyB.VN lấy cảm hứng từ các nền tảng giải trí cao cấp (Ticketmaster, StubHub phiên bản tối) kết hợp tính thẩm mỹ cinematic của poster phim và album nhạc. Mỗi màn hình phải cảm giác như một **trải nghiệm**, không chỉ là một trang web.

---

## 2. Màu sắc

### Palette chính
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-bg` | `#0A0A0F` | Background chính |
| `--color-surface` | `#13131A` | Card, modal, sidebar |
| `--color-surface-alt` | `#1C1C28` | Hover, input background |
| `--color-border` | `#2A2A3D` | Border tinh tế |
| `--color-primary` | `#7C3AED` | Tím đậm — CTA chính |
| `--color-primary-light` | `#A855F7` | Tím sáng — hover, accent |
| `--color-accent` | `#06B6D4` | Xanh cyan — highlight phụ |
| `--color-text` | `#F1F0FF` | Text chính |
| `--color-text-muted` | `#8B8BA0` | Text phụ, placeholder |
| `--color-success` | `#10B981` | Trạng thái thành công |
| `--color-error` | `#EF4444` | Lỗi |
| `--color-warning` | `#F59E0B` | Cảnh báo |

### Gradient
```css
/* Gradient chủ đạo — dùng cho hero, banner */
--gradient-primary: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);

/* Gradient tối — dùng cho overlay */
--gradient-dark: linear-gradient(180deg, transparent 0%, #0A0A0F 100%);

/* Gradient card hover */
--gradient-surface: linear-gradient(135deg, #13131A 0%, #1C1C28 100%);
```

---

## 3. Typography

### Font
```css
/* Display — tiêu đề lớn, tên sự kiện */
font-family: 'Playfair Display', serif;

/* Body — nội dung thông thường */
font-family: 'DM Sans', sans-serif;

/* Mono — mã vé, code, số liệu kỹ thuật */
font-family: 'JetBrains Mono', monospace;
```

### Scale
| Token | Size | Weight | Dùng cho |
|---|---|---|---|
| `--text-xs` | 12px | 400 | Caption, label nhỏ |
| `--text-sm` | 14px | 400 | Text phụ |
| `--text-base` | 16px | 400 | Body text |
| `--text-lg` | 18px | 500 | Subheading |
| `--text-xl` | 24px | 600 | Heading section |
| `--text-2xl` | 32px | 700 | Heading trang |
| `--text-3xl` | 48px | 700 | Hero title |
| `--text-4xl` | 64px | 800 | Display hero |

---

## 4. Spacing

```css
/* Hệ thống 4px base */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

---

## 5. Border Radius

```css
--radius-sm: 6px;    /* Input, badge nhỏ */
--radius-md: 12px;   /* Card, button */
--radius-lg: 20px;   /* Modal, panel lớn */
--radius-xl: 32px;   /* Hero card */
--radius-full: 9999px; /* Pill, avatar */
```

---

## 6. Shadow

```css
/* Tinh tế, không quá nặng */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
--shadow-md: 0 4px 16px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.5);

/* Glow effect — dùng cho CTA, element nổi bật */
--shadow-glow: 0 0 24px rgba(124, 58, 237, 0.35);
--shadow-glow-cyan: 0 0 24px rgba(6, 182, 212, 0.25);
```

---

## 7. Animation

```css
/* Timing chuẩn */
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;

/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Quy tắc animation
- Hover transition: `250ms ease-out` cho tất cả element tương tác
- Page load: fade-in + translateY(16px) → translateY(0), stagger 80ms
- Modal: scale(0.96) + opacity(0) → scale(1) + opacity(1)
- Button click: scale(0.97) → scale(1) — `150ms ease-out`

---

## 8. Components chuẩn

### Button
```css
/* Primary */
background: var(--color-primary);
color: white;
padding: 12px 24px;
border-radius: var(--radius-md);
font-weight: 600;
transition: all var(--duration-base) var(--ease-out);

/* Hover */
background: var(--color-primary-light);
box-shadow: var(--shadow-glow);
transform: translateY(-1px);
```

### Card sự kiện
- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Border-radius: `--radius-lg`
- Hover: border-color → `--color-primary` + `--shadow-glow`

### Input
- Background: `--color-surface-alt`
- Border: 1px solid `--color-border`
- Focus: border-color → `--color-primary` + glow nhẹ
- Placeholder: `--color-text-muted`

---

## 9. Seat Map

- Background khu vực stage: gradient tím-xanh
- Ghế available: `#2A2A3D` với hover `--color-primary`
- Ghế selected: `--color-primary` + glow
- Ghế đã bán: `#1C1C28`, opacity 0.4, cursor not-allowed
- Tooltip khi hover ghế: hiển thị zone, hàng, số ghế, giá

---

## 10. Responsive breakpoints

```css
/* Mobile first */
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```