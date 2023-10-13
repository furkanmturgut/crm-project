const MenuItems = [
    { id: 1, label: 'Anasayfa', active: true, icons: 'pi pi-home' },
    {
       id:2, label: 'Müşteri Yönetimi', active: false, icons: 'pi pi-id-card', submenu: [
            { id: 2, label: " -> Müşteriler" },
            { id: 3, label: " -> Müşteri Talepleri" }
        ]
    },
    { id: 3, label: 'İletişim Yönetimi', active: false, icons: 'pi pi-envelope' },
    {
       id:8, label: 'Teklif Yönetimi', active: false, icons: 'pi pi-file', submenu: [
            { id: 5, label: " -> Teklifler" },
            { id: 6, label: " -> Hazır Teklif Listesi" }
        ]
    },
    {
       id:4, label: 'Görev ve Takvim Yönetimi', active: false, icons: 'pi pi-calendar', submenu: [
            { id: 7, label: " -> Görev ve Takvim Planlama" },
            { id: 8, label: " -> Hatırlatmalar ve bildirimler" }
        ]
    },
    { id: 5, label: 'Kullanıcı Yönetimi', active: false, icons: 'pi pi-user' },

    { id: 6, label: 'Projeler & Ürünler', active: false, icons: 'pi pi-folder-open' },
    { id: 7, label: 'Çıkış Yap', active: false, icons: 'pi pi-power-off' }
]

export default MenuItems;