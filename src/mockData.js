export const mockEvents = [
  {
    id: 1,
    ten_show: "Hòa nhạc thính phòng Bach & Mozart",
    ngay_gio: "2026-05-20T20:00:00.000Z",
    dia_diem: "Nhà Hát Lớn Hà Nội, 1 Tràng Tiền, Hoàn Kiếm, Hà Nội",
    anh_banner: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1000&auto=format&fit=crop",
    organizer_name: "JoyB Entertainment",
    organizer_avatar: "https://ui-avatars.com/api/?name=JoyB&background=random",
    about_event: "Đêm nhạc cổ điển đặc biệt biểu diễn các kiệt tác của J.S.Bach và W.A.Mozart.\n\n**Dàn nhạc tham gia:** Dàn nhạc giao hưởng VNSO cùng nhạc trưởng nổi tiếng.",
    ticket_tiers: [
      { id: "t1", name: "GA-1", price: 500000, description: "Khu vực chung", color: "#3B82F6" },
      { id: "t2", name: "VVIP", price: 2500000, description: "Ghế VIP sát sân khấu, tặng kèm đồ uống", color: "#8B5CF6" }
    ],
    venueLayout: {
      sections: [
        { id: "GA-1", name: "General Admission", viewImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800" }, 
        { id: "VVIP", name: "VVIP Area", viewImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800" }
      ]
    }
  },
  {
    id: 2,
    ten_show: "The Eras Tour (Vietnam Version)",
    ngay_gio: "2026-06-15T19:00:00.000Z",
    dia_diem: "Sân vận động Mỹ Đình, Nam Từ Liêm, Hà Nội",
    anh_banner: "https://images.unsplash.com/photo-1540039155733-d71efd44e3db?q=80&w=1000&auto=format&fit=crop",
    organizer_name: "TS Tour Global",
    organizer_avatar: "https://ui-avatars.com/api/?name=TS+Tour&background=0D8ABC&color=fff",
    about_event: "Chuyến lưu diễn bùng nổ nhất năm 2026 với sân khấu hoành tráng.\n\n**Quy mô:** 40,000 khán giả.",
    ticket_tiers: [
      { id: "t3", name: "SR-E", price: 1000000, description: "Khu vực đứng SR-E", color: "#EF4444" },
      { id: "t4", name: "F1", price: 5000000, description: "Khu F1 Early Entry, Merch pack", color: "#F59E0B" }
    ],
    venueLayout: {
      sections: [
        { id: "SR-E" }, { id: "F1" }
      ]
    }
  },
  {
    id: 3,
    ten_show: "Lễ Hội Âm Nhạc EDM Watera",
    ngay_gio: "2026-07-10T16:00:00.000Z",
    dia_diem: "Phố đi bộ Nguyễn Huệ, Quận 1, TP.HCM",
    anh_banner: "https://images.unsplash.com/photo-1521337581100-8ca9a7b24326?q=80&w=1000&auto=format&fit=crop",
    organizer_name: "EDM Nation",
    organizer_avatar: "https://ui-avatars.com/api/?name=EDM+Nation&background=000&color=fff",
    about_event: "Lễ hội âm nhạc điện tử kết hợp nhạc nước lớn nhất mùa hè với sự góp mặt của các DJ hàng đầu thế giới.",
    ticket_tiers: [
      { id: "t5", name: "GA-1", price: 750000, description: "Khu vực phổ thông", color: "#10B981" },
      { id: "t6", name: "VVIP", price: 3500000, description: "Khu VIP trên cao, thức uống miễn phí", color: "#EC4899" }
    ],
    venueLayout: {
      sections: [
        { id: "GA-1" }, { id: "VVIP" }
      ]
    }
  }
];

export const mockUsers = [
  { id: 1, name: "Admin_Linh", email: "admin@joyb.vn", role: "admin" },
  { id: 2, name: "User Guest", email: "user@demo.com", role: "user" }
];
