# Prompt Template — JoyB.VN

> Copy template phù hợp và điền vào khi yêu cầu Claude hỗ trợ.  
> Template giúp Claude hiểu đúng context và cho output chuẩn ngay lần đầu.

---

## Template 1 — Viết code tính năng mới

```
**Dự án:** JoyB.VN — Hệ thống bán vé sự kiện
**Tech stack:** [React / Node.js Express / MySQL — ghi rõ phần đang làm]
**Tính năng cần làm:** [Mô tả tính năng]

**Context:**
- Đang ở phase: [Phase 1–6]
- File/module liên quan: [Tên file hoặc component]
- Dữ liệu đầu vào: [Mô tả input]
- Kết quả mong muốn: [Mô tả output]

**Yêu cầu:**
- Comment tiếng Việt ở đầu hàm và phần logic quan trọng
- Tuân theo StyleGuide (màu sắc, spacing, animation như đã định nghĩa)
- Code đầy đủ, không rút gọn
- [Yêu cầu khác nếu có]
```

---

## Template 2 — Debug / Fix lỗi

```
**Dự án:** JoyB.VN
**Mô tả lỗi:** [Mô tả lỗi xảy ra]
**Lỗi hiển thị:** [Paste error message hoặc console log]

**Code hiện tại:**
[Paste đoạn code bị lỗi]

**Đã thử:**
- [Những gì đã thử]

**Mong muốn:** [Output đúng là gì]
```

---

## Template 3 — Thiết kế UI Component

```
**Dự án:** JoyB.VN
**Component cần tạo:** [Tên component]
**Mô tả:** [Component này làm gì, hiển thị ở đâu]

**Dữ liệu hiển thị:**
- [Field 1]: [kiểu dữ liệu]
- [Field 2]: [kiểu dữ liệu]

**Thiết kế:**
- Style: Modern, Minimal, Cinematic (theo StyleGuide JoyB.VN)
- Màu: Dark theme — background #0A0A0F, primary #7C3AED
- Animation: hover mượt mà, transition 250ms ease-out
- Responsive: mobile-first, test 375px / 768px / 1280px

**Output mong muốn:** [HTML+CSS / React component / cả hai]
```

---

## Template 4 — Thiết kế Database / API

```
**Dự án:** JoyB.VN
**Yêu cầu:** [Thiết kế bảng / API endpoint]

**Nghiệp vụ:**
[Mô tả logic nghiệp vụ cần hỗ trợ]

**Bảng liên quan (nếu có):**
[Tên bảng và các cột chính]

**Yêu cầu:**
- Tuân theo convention: tên bảng snake_case số nhiều
- Có created_at, updated_at
- Response API theo format chuẩn: { success, data, message }
- [Yêu cầu khác]
```

---

## Template 5 — Viết báo cáo / tài liệu học thuật

```
**Dự án:** JoyB.VN — Chuyên đề tốt nghiệp
**Phần cần viết:** [Chương / mục cụ thể]

**Nội dung cần trình bày:**
- [Điểm 1]
- [Điểm 2]

**Giọng văn:** Học thuật, trang trọng, tiếng Việt chuẩn
**Độ dài mong muốn:** [Khoảng X trang / X từ]
**Yêu cầu đặc biệt:** [Có cần trích dẫn / sơ đồ / bảng biểu không]
```

---

## Template 6 — Review & Cải thiện code

```
**Dự án:** JoyB.VN
**Yêu cầu:** Review đoạn code sau và đề xuất cải thiện

**Code:**
[Paste code vào đây]

**Tiêu chí đánh giá:**
- [ ] Code logic đúng không
- [ ] Có lỗi bảo mật nào không
- [ ] Performance có thể tối ưu không
- [ ] Đúng convention của dự án không (comment, naming, structure)
- [ ] Xử lý lỗi đầy đủ chưa
```