document.addEventListener('DOMContentLoaded', () => {

    // 1. Fungsi Smooth Scrolling & Fade-in
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transition = 'opacity 1s ease-out';
    });

    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = 1;
        });
    }, 100);

    // 2. Efek Animasi saat Menggulir (Scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .video-item, .info-section, .contact-section').forEach(element => {
        sectionObserver.observe(element);
    });

    // 3. Fungsionalitas Modal Pemesanan (khusus halaman produk)
    const buyButtons = document.querySelectorAll('.buy-button');
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-button');
    const orderForm = document.getElementById('order-form');
    const produkInput = document.getElementById('produk');
    const hargaInput = document.getElementById('harga');
    const applyVoucherBtn = document.getElementById('apply-voucher');
    const voucherInput = document.getElementById('voucher');
    const voucherMessage = document.getElementById('voucher-message');
    
    let originalPrice = 0;

    // Data voucher berbasis persentase
    const vouchers = {
        'DISKON5': 0.05, // Diskon 5%
        'DISKON2': 0.02, // Diskon 2%
        'PROMO50': 0.50, // Diskon 50%
    };

    if (modal) {
        // Menampilkan modal dan mengisi data produk
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productName = button.getAttribute('data-product');
                const productPrice = parseFloat(button.getAttribute('data-price'));

                produkInput.value = productName;
                hargaInput.value = `Rp ${productPrice.toLocaleString('id-ID')}`;
                originalPrice = productPrice;
                
                // Reset voucher
                voucherInput.value = '';
                voucherMessage.textContent = '';
                
                modal.style.display = 'block';
            });
        });

        // Menutup modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });

        // Menerapkan voucher berbasis persentase
        applyVoucherBtn.addEventListener('click', () => {
            const voucherCode = voucherInput.value.toUpperCase();
            let newPrice = originalPrice;
            let diskon = 0;

            if (vouchers[voucherCode]) {
                const diskonPersen = vouchers[voucherCode];
                diskon = originalPrice * diskonPersen;
                newPrice = originalPrice - diskon;
                hargaInput.value = `Rp ${Math.max(0, newPrice).toLocaleString('id-ID')}`;
                
                // Pesan diskon
                const diskonPersenTeks = (diskonPersen * 100).toFixed(0);
                voucherMessage.textContent = `Voucher "${voucherCode}" berhasil diterapkan! Diskon: ${diskonPersenTeks}%`;
                voucherMessage.style.color = 'green';
            } else {
                hargaInput.value = `Rp ${originalPrice.toLocaleString('id-ID')}`;
                voucherMessage.textContent = 'Kode voucher tidak valid.';
                voucherMessage.style.color = 'red';
            }
        });

        // Mengirim pesan WhatsApp dengan validasi
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value;
            const pembayaran = document.querySelector('input[name="pembayaran"]:checked');
            
            // Validasi: Cek jika nama atau pembayaran belum diisi
            if (nama.trim() === '') {
                alert('Nama lengkap wajib diisi.');
                document.getElementById('nama').focus();
                return;
            }
            
            if (!pembayaran) {
                alert('Pilih salah satu metode pembayaran.');
                return;
            }

            const produk = produkInput.value;
            const harga = hargaInput.value;
            const pembayaranValue = pembayaran.value;
            const voucherCode = voucherInput.value.toUpperCase();
            
            let message = `*Fauzi Tunneling - Pesanan Baru*\n\n`;
            message += `*Nama:* ${nama}\n`;
            message += `*Produk:* ${produk}\n`;
            message += `*Harga Akhir:* ${harga}\n`;
            message += `*Metode Pembayaran:* ${pembayaranValue}\n`;
            
            if (voucherCode && vouchers[voucherCode]) {
                const diskonPersen = vouchers[voucherCode];
                const diskonTeks = (diskonPersen * 100).toFixed(0);
                message += `*Voucher Digunakan:* ${voucherCode} (Diskon ${diskonTeks}%)\n`;
            } else {
                message += `*Voucher Digunakan:* Tidak ada\n`;
            }

            const whatsappURL = `https://wa.me/6285238906544?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');
        });
    }
    
    // Kode untuk fitur fullscreen video
    const videos = document.querySelectorAll('.video-item video');

    videos.forEach(video => {
        video.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
    });

});
