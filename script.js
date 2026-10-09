// ==========================================================
// PRELOAD ẢNH NHÂN VẬT ĐỂ KHÔNG BỊ KHỰNG KHI CLICK
// ==========================================================
const characterList = [
  "./Genshin.img/Venti.png",
  "./Genshin.img/Klee.png",
  "./Genshin.img/Nicole.png",
];

characterList.forEach((imagePath) => {
  const img = new Image();
  img.src = imagePath;
});
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // XỬ LÝ CHUYỂN TRANG MƯỢT MÀ GIỮA TRANG CHỦ VÀ TIN TỨC (SPA)
  // ==========================================================
  const navHome = document.getElementById("navHome");
  const navNews = document.getElementById("navNews");

  const homePage = document.getElementById("home-page");
  const newsPage = document.getElementById("news-page");

  // Khi bấm nút "Trang Chủ"
  if (navHome && homePage) {
    navHome.addEventListener("click", (e) => {
      e.preventDefault();
      if (newsPage) newsPage.classList.remove("active");
      homePage.classList.add("active");

      if (navNews) navNews.classList.remove("active");
      navHome.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // XỬ LÝ NÚT "TẢI THÊM" Ở TRANG CHỦ CHUYỂN SANG TRANG TIN TỨC
    const homeMoreNewsBtn = document.getElementById("homeMoreNewsBtn");

    if (homeMoreNewsBtn) {
      homeMoreNewsBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Ẩn trang chủ, bật trang tin tức chính
        showOnlyPage(newsPage);

        // Đồng bộ vạch vàng trên Header sang mục TIN TỨC
        if (navHome) navHome.classList.remove("active");
        if (navNews) navNews.classList.add("active");
      });
    }

    // ==========================================================
    // XỬ LÝ LỌC BÀI VIẾT THEO DANH MỤC (THÔNG TIN / SỰ KIỆN / CẬP NHẬT)
    // ==========================================================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const newsCards = document.querySelectorAll(".news-page-card");

    if (filterBtns.length > 0 && newsCards.length > 0) {
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          // 1. Đổi màu nút vừa bấm (class active)
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // 2. Lấy tên danh mục cần lọc (all, thong-tin, su-kien, cap-nhat)
          const selectedCategory = btn.getAttribute("data-category");

          // 3. Ẩn / Hiện thẻ bài viết tương ứng
          newsCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");

            if (
              selectedCategory === "all" ||
              cardCategory === selectedCategory
            ) {
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          });
        });
      });
    }

    // ==========================================================
    // XỬ LÝ BẤM NÚT TẢI THÊM ĐỂ HIỆN CÁC THẺ CARD BỊ ẨN
    // ==========================================================
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        // Lấy tất cả thẻ bài viết đang có class hidden-news
        const hiddenCards = document.querySelectorAll(
          ".news-page-card.hidden-news",
        );

        hiddenCards.forEach((card) => {
          card.style.display = "flex"; // Hiện thẻ card ra
          card.classList.remove("hidden-news");
        });

        // Khi đã mở hết bài viết thì đổi chữ và làm mờ nút
        loadMoreBtn.innerText = "Đã Tải Hết Tin Tức";
        loadMoreBtn.style.opacity = "0.5";
        loadMoreBtn.style.cursor = "default";
        loadMoreBtn.disabled = true;
      });
    }
  }

  // Khi bấm nút "Tin Tức"
  if (navNews && newsPage) {
    navNews.addEventListener("click", (e) => {
      e.preventDefault();
      if (homePage) homePage.classList.remove("active");
      newsPage.classList.add("active");

      if (navHome) navHome.classList.remove("active");
      navNews.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Xử lý Lọc bài tin theo Tab (Mới / Sự Kiện / Thông Báo / Nhân Vật) */
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabBtns.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-category");

      newsItems.forEach((item) => {
        const itemTag = item.getAttribute("data-tag");
        if (category === "all" || itemTag === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      // Tự động bấm chọn bài tin đầu tiên thuộc danh mục đó để đổi ảnh ngay lập tức
      const firstVisible = Array.from(newsItems).find(
        (i) => i.style.display !== "none",
      );
      if (firstVisible) firstVisible.click();
    });
  });

  // ==========================================================
  // XỬ LÝ LỌC TIN TỨC & TẢI THÊM NỐI TIẾP (3 BÀI MỖI LẦN BẤM)
  // ==========================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-page-card");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let currentCategory = "all"; // Mặc định chọn danh mục "Tất Cả"
  let visibleCount = 3; // Mặc định mỗi mục chỉ hiện 3 bài

  // Hàm xử lý ẩn / hiện bài viết theo danh mục và số lượng
  function updateNewsDisplay() {
    // 1. Gom tất cả các bài thuộc danh mục đang chọn vào một danh sách
    const matchingCards = [];
    newsCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      if (currentCategory === "all" || cardCategory === currentCategory) {
        matchingCards.push(card);
      }
      card.style.display = "none"; // Mặc định ẩn toàn bộ bài viết trước
    });

    // 2. Chỉ hiển thị đúng số lượng bài viết cho phép (visibleCount)
    for (let i = 0; i < Math.min(visibleCount, matchingCards.length); i++) {
      matchingCards[i].style.display = "flex";
    }

    // 3. Xử lý trạng thái của nút "Tải Thêm"
    if (loadMoreBtn) {
      // Nếu số bài đang hiện >= tổng số bài trong mục đó
      if (visibleCount >= matchingCards.length) {
        loadMoreBtn.innerText = "Đã Tải Hết Tin Tức";
        loadMoreBtn.style.opacity = "0.5";
        loadMoreBtn.style.cursor = "default";
        loadMoreBtn.disabled = true;
      } else {
        loadMoreBtn.innerText = "Tải Thêm";
        loadMoreBtn.style.opacity = "1";
        loadMoreBtn.style.cursor = "pointer";
        loadMoreBtn.disabled = false;
      }
    }
  }

  // Sự kiện khi bấm các nút bộ lọc (Tất Cả, Thông Tin, Sự Kiện, Cập Nhật)
  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Đổi màu sáng cho nút được chọn
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Đổi danh mục & reset lại chỉ hiển thị 3 bài đầu tiên
        currentCategory = btn.getAttribute("data-category");
        visibleCount = 3;

        updateNewsDisplay();
      });
    });
  }

  // Sự kiện khi bấm nút "Tải Thêm"
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 3; // Mỗi lần bấm sẽ cộng thêm 3 bài nữa
      updateNewsDisplay();
    });
  }

  // Tự động chạy lần đầu tiên khi mở trang Tin Tức
  updateNewsDisplay();
  // ==========================================================
  // XỬ LÝ BẤM "XEM CHI TIẾT" & CHUYỂN TRANG KHÔNG BỊ ĐÈ GIAO DIỆN
  // ==========================================================
  const newsDetailPage = document.getElementById("news-detail-page");
  const backToNewsBtn = document.getElementById("backToNewsBtn");
  const breadcrumbHome = document.getElementById("breadcrumbHome");
  const breadcrumbNews = document.getElementById("breadcrumbNews");

  const detailTitle = document.getElementById("detailTitle");
  const detailDate = document.getElementById("detailDate");
  const detailCategoryTag = document.getElementById("detailCategoryTag");
  const detailBreadcrumbTitle = document.getElementById(
    "detailBreadcrumbTitle",
  );
  const detailBannerImg = document.getElementById("detailBannerImg");
  const detailDescText = document.getElementById("detailDescText");

  // HÀM QUAN TRỌNG: Tắt sạch toàn bộ các trang trước khi mở trang mới
  function showOnlyPage(pageToShow) {
    if (homePage) homePage.classList.remove("active");
    if (newsPage) newsPage.classList.remove("active");
    if (newsDetailPage) newsDetailPage.classList.remove("active");

    if (pageToShow) pageToShow.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Lắng nghe sự kiện bấm vào bất kỳ bài viết nào để "Xem chi tiết"
  document.addEventListener("click", (e) => {
    const readMoreBtn = e.target.closest(
      ".news-read-more, .news-page-card, .news-item",
    );

    if (readMoreBtn && !e.target.closest("#news-detail-page")) {
      e.preventDefault();

      const card = e.target.closest(
        ".news-page-card, .news-list-item, .news-item",
      );
      if (!card) return;

      const title =
        card.querySelector("h3, .news-item-title")?.innerText ||
        "Tin tức Genshin Impact";
      const date =
        card.querySelector(".news-card-date, .news-item-date, .date")
          ?.innerText || "06/10/2026";
      const category =
        card.querySelector(".news-card-tag, .news-item-tag, .tag")?.innerText ||
        "Thông tin";
      const imgSrc =
        card.querySelector("img")?.src || "./Genshin_News.img/Thong_tin1.jpg";
      const desc =
        card.querySelector("p, .news-item-desc")?.innerText ||
        "Nội dung chi tiết bài viết đang được cập nhật...";

      if (detailTitle) detailTitle.innerText = title;
      if (detailDate) detailDate.innerText = date;
      if (detailCategoryTag) detailCategoryTag.innerText = category;
      if (detailBreadcrumbTitle) detailBreadcrumbTitle.innerText = title;
      if (detailBannerImg) detailBannerImg.src = imgSrc;
      if (detailDescText) detailDescText.innerText = desc;

      showOnlyPage(newsDetailPage); // Chỉ mở duy nhất trang Chi Tiết
    }
  });

  // Sự kiện nút "Trở Về Tin Tức" & Đường dẫn Breadcrumb "Tin Tức"
  function returnToNewsList(e) {
    if (e) e.preventDefault();
    showOnlyPage(newsPage);
    if (navHome) navHome.classList.remove("active");
    if (navNews) navNews.classList.add("active");
  }

  if (backToNewsBtn) backToNewsBtn.addEventListener("click", returnToNewsList);
  if (breadcrumbNews)
    breadcrumbNews.addEventListener("click", returnToNewsList);

  // Sự kiện Breadcrumb "Trang Chủ" trên trang chi tiết
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener("click", (e) => {
      e.preventDefault();
      showOnlyPage(homePage);
      if (navNews) navNews.classList.remove("active");
      if (navHome) navHome.classList.add("active");
    });
  }

  // XỬ LÝ NÚT MENU HEADER TOP: Đảm bảo bấm "Trang Chủ" hoặc "Tin Tức" ở Header cũng tắt trang Chi Tiết
  if (navHome) {
    navHome.addEventListener("click", (e) => {
      e.preventDefault();
      showOnlyPage(homePage);
      if (navNews) navNews.classList.remove("active");
      navHome.classList.add("active");
    });
  }

  if (navNews) {
    navNews.addEventListener("click", (e) => {
      e.preventDefault();
      showOnlyPage(newsPage);
      if (navHome) navHome.classList.remove("active");
      navNews.classList.add("active");
    });
  }

  // ==========================================================
  // HÀM ĐỒNG BỘ DỮ LIỆU BÀI VIẾT TỪ MỌI NGUỒN VÀO TRANG CHI TIẾT
  // ==========================================================
  function openNewsDetail(element) {
    if (!element) return;

    // 1. Trích xuất Tiêu đề
    const title =
      element.getAttribute("data-title") ||
      element.querySelector("h3, h4, .news-item-title")?.innerText ||
      "Tin tức Genshin Impact";

    // 2. Trích xuất Ngày đăng
    const date =
      element.getAttribute("data-date") ||
      element.querySelector(".news-card-date, .news-item-date, span")
        ?.innerText ||
      "06/10/2026";

    // 3. Trích xuất Danh mục (Thông tin / Sự kiện / Bản tin)
    const category =
      element.getAttribute("data-tag") ||
      element.querySelector(".news-card-tag, .news-item-tag")?.innerText ||
      "Thông tin";

    // 4. Trích xuất Ảnh đại diện
    const imgSrc =
      element.getAttribute("data-img") ||
      element.querySelector("img")?.src ||
      "./Genshin_News.img/Thong_tin1.jpg";

    // 5. Trích xuất Nội dung mô tả
    const desc =
      element.getAttribute("data-desc") ||
      element.querySelector("p, .news-item-desc")?.innerText ||
      "Nội dung chi tiết bài viết đang được cập nhật...";

    // 6. Trích xuất Mã Video Youtube
    const youtubeId = element.getAttribute("data-youtube-id");

    // --- ĐỔ DỮ LIỆU VÀO GIAO DIỆN TRANG CHI TIẾT ---
    if (detailTitle) detailTitle.innerText = title;
    if (detailDate) detailDate.innerText = date;
    if (detailCategoryTag) detailCategoryTag.innerText = category;
    if (detailBreadcrumbTitle) detailBreadcrumbTitle.innerText = title;
    if (detailBannerImg) detailBannerImg.src = imgSrc;
    if (detailDescText) detailDescText.innerText = desc;

    // --- XỬ LÝ ẨN / HIỆN VIDEO YOUTUBE ---
    const videoWrapper = document.getElementById("detailVideoWrapper");
    const videoLink = document.getElementById("detailVideoLink");
    const videoThumb = document.getElementById("detailVideoThumb");

    if (youtubeId && youtubeId.trim() !== "") {
      if (videoWrapper) videoWrapper.style.display = "block";
      if (videoLink)
        videoLink.href = `https://www.youtube.com/watch?v=${youtubeId}`;
      if (videoThumb)
        videoThumb.src = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    } else {
      if (videoWrapper) videoWrapper.style.display = "none";
    }

    // --- CẬP NHẬT THANH MENU HEADER SANG "TIN TỨC" ---
    if (navHome) navHome.classList.remove("active");
    if (navNews) navNews.classList.add("active");

    // Chuyển duy nhất sang trang Chi Tiết
    showOnlyPage(newsDetailPage);
  }

  // ==========================================================
  // LẮNG NGHE SỰ KIỆN BẤM TỪ BẤT KỲ ĐÂU (TRANG CHỦ / TIN TỨC / SIDEBAR)
  // ==========================================================
  document.addEventListener("click", (e) => {
    const targetCard = e.target.closest(
      ".news-page-card, .news-item, .sidebar-news-item",
    );

    if (!targetCard) return;

    // Cho phép bấm ở Sidebar (kể cả nằm trong trang chi tiết) HOẶC các bài ở ngoài trang chủ/tin tức
    if (
      targetCard.classList.contains("sidebar-news-item") ||
      !e.target.closest("#news-detail-page")
    ) {
      e.preventDefault();
      openNewsDetail(targetCard);
    }
  });

  /* ==========================================================================
       1. XỬ LÝ TÍNH NĂNG CHUYỂN ĐỔI TIN TỨC CỦA TRANG CHỦ (NEWS SELECTOR)
       ========================================================================== */
  const newsSlides = document.querySelectorAll(".banner-slide");
  const newsDots = document.querySelectorAll(".dot");
  const newsItems = document.querySelectorAll(".news-item");
  const newsBannerBox = document.getElementById("news-featured-box");

  // Các thẻ chữ hiển thị bên dưới banner
  const featuredTag = document.getElementById("featured-tag");
  const featuredDate = document.getElementById("featured-date");
  const featuredTitle = document.getElementById("featured-title");
  const featuredDesc = document.getElementById("featured-desc");

  let currentNewsIndex = 0;
  let newsTimer;

  // Hàm cập nhật đồng bộ cả Banner, Tiêu đề lẫn Tin tức đang chọn
  function updateNewsSlide(index) {
    currentNewsIndex = index;
    if (currentNewsIndex >= newsSlides.length) currentNewsIndex = 0;
    if (currentNewsIndex < 0) currentNewsIndex = newsSlides.length - 1;

    // 1. Chuyển Slide Ảnh
    newsSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentNewsIndex);
    });

    // 2. Chuyển Chấm Tròn
    newsDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentNewsIndex);
    });

    // 3. Highlight Tin tức tương ứng trong danh sách bên phải
    newsItems.forEach((item, i) => {
      item.classList.toggle("active", i === currentNewsIndex);
    });

    // 4. Cập nhật Tiêu đề, Ngày, Mô tả dưới Banner theo data của Tin tức đó
    const activeItem = newsItems[currentNewsIndex];
    if (activeItem) {
      if (featuredTag)
        featuredTag.textContent =
          activeItem.getAttribute("data-tag") || "Sự Kiện";
      if (featuredDate)
        featuredDate.textContent = activeItem.getAttribute("data-date") || "";
      if (featuredTitle)
        featuredTitle.textContent = activeItem.getAttribute("data-title") || "";
      if (featuredDesc)
        featuredDesc.textContent = activeItem.getAttribute("data-desc") || "";
    }
  }

  // Chạy đếm ngược 5 giây
  function startNewsAutoPlay() {
    stopNewsAutoPlay();
    newsTimer = setInterval(() => {
      updateNewsSlide(currentNewsIndex + 1);
    }, 5000);
  }

  function stopNewsAutoPlay() {
    if (newsTimer) clearInterval(newsTimer);
  }

  // 🔑 SỰ KIỆN 1: Bấm vào chấm tròn
  newsDots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      updateNewsSlide(idx);
      startNewsAutoPlay();
    });
  });

  // 🔑 SỰ KIỆN 2: Bấm vào từng bài tin trong danh sách bên phải
  newsItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      updateNewsSlide(idx);
      startNewsAutoPlay(); // Đếm lại 5s từ đầu
    });
  });

  // Tạm dừng khi rê chuột vào khu vực tin tức
  if (newsBannerBox) {
    newsBannerBox.addEventListener("mouseenter", stopNewsAutoPlay);
    newsBannerBox.addEventListener("mouseleave", startNewsAutoPlay);
  }

  // Chạy ngay khi tải trang
  startNewsAutoPlay();
  /* ==========================================================================
       3. XỬ LÝ SAO CHÉP MÃ QUÀ (COPY GIFTCODE)
       ========================================================================== */
  const copyButtons = document.querySelectorAll(".btn-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Tìm mã quà nằm cùng thẻ cha .code-card
      const codeCard = this.closest(".code-card");
      const codeText = codeCard.querySelector(".code-text").innerText;

      // Sao chép vào khay nhớ tạm Clipboard
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          const originalText = this.innerText;

          // Phản hồi trực quan trên nút
          this.innerText = "Đã Chép!";
          this.style.background = "#4cc2f8";
          this.style.color = "#fff";

          // Trả lại trạng thái ban đầu sau 2 giây
          setTimeout(() => {
            this.innerText = originalText;
            this.style.background = "var(--accent-gold)";
            this.style.color = "#000";
          }, 2000);
        })
        .catch((err) => {
          console.error("Lỗi khi sao chép mã:", err);
        });
    });
  });

  /* ==========================================================================
       4. TƯƠNG TÁC THẺ QUỐC GIA (NATION CARDS CLICK)
       ========================================================================== */
  const nationCards = document.querySelectorAll(".nation-card");

  nationCards.forEach((card) => {
    card.addEventListener("click", function () {
      const nationName = this.querySelector("h3").innerText;
      /* 📌 [HƯỚNG DẪN SINH VIÊN]: 
               Bạn có thể mở rộng tính năng này để chuyển hướng sang trang chi tiết 
               hoặc hiển thị Modal thông tin nhân vật của quốc gia đó. */
      // alert(`Bạn vừa chọn khám phá quốc gia: ${nationName}!`);
    });
  });
  /* ==========================================================================
       5. HIỆN NHÂN VẬT ĐẠI DIỆN BÊN PHẢI KHI RÊ CHUỘT (HOVER)
       ========================================================================== */
  const charImg = document.getElementById("nation-char-img");

  if (nationCards.length > 0 && charImg) {
    nationCards.forEach((card) => {
      // Khi RÊ CHUỘT VÀO -> Hiện nhân vật
      card.addEventListener("mouseenter", function () {
        const charPath = this.getAttribute("data-character");
        if (charPath) {
          charImg.src = charPath;
          charImg.classList.add("active");
        }
      });

      // Khi RỜI CHUỘT RA -> Ẩn nhân vật
      card.addEventListener("mouseleave", function () {
        charImg.classList.remove("active");
      });
    });
  }
});

//  5. HIỆN Nền ĐẠI DIỆN BÊN PHẢI KHI RÊ CHUỘT (HOVER)

document.addEventListener("DOMContentLoaded", () => {
  const nationsSection = document.querySelector(".nations-section");
  const nationCards = document.querySelectorAll(".nation-card");

  if (nationsSection && nationCards.length > 0) {
    // 1. Lưu lại đường dẫn hình nền mặc định ban đầu của Section
    const defaultBg = "Genshin.img/Background 1.jpg";

    nationCards.forEach((card) => {
      // 2. Khi ĐƯA CHUỘT VÀO bất kỳ thẻ quốc gia nào:
      card.addEventListener("mouseenter", () => {
        const bgImg = card.querySelector(".nation-bg");
        if (bgImg && bgImg.src) {
          // Đổi hình nền chính đằng sau thành ảnh bối cảnh của quốc gia đó
          nationsSection.style.backgroundImage = `url("${bgImg.src}")`;
        }
      });

      // 3. Khi RỜI CHUỘT CỬA KHỎI thẻ:
      card.addEventListener("mouseleave", () => {
        // Khôi phục lại hình nền mặc định ban đầu
        nationsSection.style.backgroundImage = `url("${defaultBg}")`;
      });
    });
  }
});
// ==========================================================
// TỰ ĐỘNG CHUYỂN BÀI / LẶP BÀI KHÔNG BỊ BẬT ALERT THÔNG BÁO
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgMusic");
  const autoNextBtn = document.getElementById("toggleAutoNextBtn");
  const playlistItems = document.querySelectorAll(".playlist-item");

  // Lấy các phần tử hiển thị tên bài hát ở trình phát nhạc cố định
  const trackTitle = document.querySelector(".track-title");
  const trackArtist = document.querySelector(".track-artist");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const musicMenuBtn = document.getElementById("musicMenuBtn");
  const musicDropdown = document.getElementById("musicDropdown");

  // BẬT / TẮT BẢNG DANH SÁCH BÀI HÁT KHI BẤM NÚT MUSIC
  if (musicMenuBtn && musicDropdown) {
    musicMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Tránh bị sự kiện click toàn trang đóng menu ngay lập tức
      musicDropdown.classList.toggle("show"); // Thêm / Xóa class 'show' để hiện menu
    });

    // Tự động đóng Menu bài hát khi bấm ra ngoài vùng menu
    document.addEventListener("click", (e) => {
      if (
        !musicDropdown.contains(e.target) &&
        !musicMenuBtn.contains(e.target)
      ) {
        musicDropdown.classList.remove("show");
      }
    });
  }
  let isAutoNext = true; // Mặc định BẬT tự động chuyển bài

  if (audio) {
    audio.loop = false; // Tắt lặp mặc định
  }
  // 🔑 CHÈN NGAY DƯỚI DÒNG 264: Bắt sự kiện click cho nút Play/Pause
  if (playPauseBtn && audio) {
    playPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play(); // Nếu đang dừng thì phát
      } else {
        audio.pause(); // Nếu đang phát thì tạm dừng
      }
    });
  }

  // Tự động đổi Icon Tam giác <-> 2 gạch khi nhạc Phát/Dừng
  if (audio && playPauseBtn) {
    audio.addEventListener("play", () => {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    });
    audio.addEventListener("pause", () => {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
  }
  // 1. Nút Bật / Tắt Tự động chuyển bài
  if (autoNextBtn) {
    autoNextBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Tránh đóng menu nhạc
      isAutoNext = !isAutoNext;

      if (isAutoNext) {
        autoNextBtn.classList.add("active");
        autoNextBtn.innerHTML =
          '<i class="fa-solid fa-repeat"></i> Tự động chuyển bài: BẬT';
        if (audio) audio.loop = false;
      } else {
        autoNextBtn.classList.remove("active");
        autoNextBtn.innerHTML =
          '<i class="fa-solid fa-rotate-right"></i> Tự động chuyển bài: TẮT';
        if (audio) audio.loop = true; // Bật lặp lại duy nhất 1 bài đang phát
      }
    });
  }

  // 2. Hàm chuyển bài hát trực tiếp (Không dùng .click() gián tiếp để tránh dính alert)
  function switchAndPlayTrack(item) {
    if (!item || !audio) return;

    // Lấy thông tin bài hát từ thuộc tính data-
    const src = item.getAttribute("data-src");
    const title = item.getAttribute("data-title");
    const artist = item.getAttribute("data-artist");

    // Cập nhật lớp active cho bài hát được chọn
    playlistItems.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");

    // Đổi nguồn nhạc và thông tin hiển thị
    if (src) audio.src = src;
    if (trackTitle && title) trackTitle.textContent = title;
    if (trackArtist && artist) trackArtist.textContent = artist;

    // Phát nhạc trực tiếp và bắt lỗi im lặng (không bật alert)
    audio
      .play()
      .then(() => {
        if (playPauseBtn) {
          playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
      })
      .catch((err) => {
        // Xử lý lỗi ngầm trên Console thay vì hiện alert cho người dùng
        console.log("Trình duyệt yêu cầu tương tác để phát nhạc:", err);
      });
  }

  // 3. Gán sự kiện click trực tiếp cho từng bài hát trong danh sách
  playlistItems.forEach((item) => {
    item.addEventListener("click", () => {
      switchAndPlayTrack(item);
    });
  });

  // 4. Lắng nghe khi bài hát kết thúc (Ended)
  if (audio) {
    audio.addEventListener("ended", () => {
      if (isAutoNext) {
        // Tìm bài đang active hiện tại
        let currentIndex = -1;
        playlistItems.forEach((item, index) => {
          if (item.classList.contains("active")) {
            currentIndex = index;
          }
        });

        // Chuyển sang bài tiếp theo trong danh sách (Chạy vòng tròn)
        let nextIndex = (currentIndex + 1) % playlistItems.length;
        switchAndPlayTrack(playlistItems[nextIndex]);
      }
    });
  }
});
// ==========================================================
// TỰ ĐỘNG CHUYỂN BÀI THEO THỨ TỰ (KHÔNG BỊ NHẢY CÓC BÀI)
// ==========================================================
const currentAudio =
  typeof audio !== "undefined" ? audio : document.getElementById("bgMusic");

if (currentAudio) {
  // Dùng onended để đảm bảo chỉ chạy đúng 1 lần khi hết bài
  currentAudio.onended = () => {
    if (
      typeof isAutoNext !== "undefined" &&
      isAutoNext &&
      playlistItems &&
      playlistItems.length > 0
    ) {
      let currentIndex = -1;

      // Tìm bài hát đang active hiện tại
      playlistItems.forEach((item, index) => {
        if (item.classList.contains("active")) {
          currentIndex = index;
        }
      });

      // Lấy chính xác bài kế tiếp (1 -> 2 -> 3 -> vòng lại 1)
      let nextIndex = (currentIndex + 1) % playlistItems.length;

      // Kích hoạt chuyển sang bài tiếp theo
      if (typeof switchAndPlayTrack === "function") {
        switchAndPlayTrack(playlistItems[nextIndex]);
      } else {
        playlistItems[nextIndex].click();
      }
    }
  };
}
// ==========================================================
// TỰ ĐỘNG XOAY ĐĨA NHẠC VÀ ĐỔI ICON PLAY/PAUSE KHI PHÁT / DỪNG
// ==========================================================
const musicAudio =
  typeof currentAudio !== "undefined"
    ? currentAudio
    : document.getElementById("bgMusic");
const playerIcon = document.getElementById("playerToggleBtn");
const playPauseBtn = document.getElementById("playPauseBtn");

if (musicAudio) {
  // Khi nhạc bắt đầu phát -> Xoay đĩa + Đổi icon nút bấm thành Pause (2 gạch)
  musicAudio.addEventListener("play", () => {
    if (playerIcon) playerIcon.classList.add("playing");
    if (playPauseBtn)
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  });

  // Khi nhạc tạm dừng -> Ngừng xoay đĩa + Đổi icon nút bấm thành Play (Tam giác)
  musicAudio.addEventListener("pause", () => {
    if (playerIcon) playerIcon.classList.remove("playing");
    if (playPauseBtn)
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  });
}

// =========================================================
// XỬ LÝ BẬT / TẮT POPUP MODAL "TẢI GAME"
// =========================================================
document.addEventListener("DOMContentLoaded", function () {
  // 1. Lấy các phần tử DOM theo ID
  const openBtn = document.getElementById("openDownloadModalBtn");
  const closeBtn = document.getElementById("closeDownloadModalBtn");
  const modal = document.getElementById("downloadModal");

  // Kiểm tra nếu các phần tử tồn tại trên trang mới gán sự kiện
  if (openBtn && closeBtn && modal) {
    // Hàm mở Modal Popup
    function openModal() {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Khóa cuộn trang khi mở popup
    }

    // Hàm đóng Modal Popup
    function closeModal() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // Mở lại cuộn trang
    }

    // Sự kiện 1: Bấm nút "Tải Game" màu vàng trên Navbar -> Mở Popup
    openBtn.addEventListener("click", openModal);

    // Sự kiện 2: Bấm nút 'X' góc trên bên phải -> Đóng Popup
    closeBtn.addEventListener("click", closeModal);

    // Sự kiện 3: Bấm ra ngoài nền đen (Overlay) -> Đóng Popup
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Sự kiện 4: Bấm phím 'Esc' trên bàn phím -> Đóng Popup
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});

// ==========================================================
// KHO DỮ LIỆU BÀI VIẾT GIỚI THIỆU CÁC QUỐC GIA (KÈM ẢNH)
// ==========================================================
const nationDetailsData = {
  mondstadt: {
    name: "Mondstadt",
    spots: [
      {
        title: "Hồ Rượu Trái Cây",
        desc: "Là hồ nước ngọt tự nhiêu bao quanh Thành Mondstadt.Từ ngàn năm qua, mặt hồ rộng lớn và những con sóng lấp lánh vẫn không thay đổi, dòng nước trong vắt, vị lại ngọt dịu, thanh khiết. Cũng chính nguồn nước này đã tạo nên thứ rượu nổi tiếng Mondstadt, đồng thời biến Hồ Rượu Trái Cây trở thành một trong những biểu tượng của Mondstadt.",
        img: "Genshin_country.img/Monstard1.jpg",
      },
      {
        title: "Bờ Biển Falcon",
        desc: "Từ Phong Khởi Địa trải dọc về phía đông ra tới biển, Bờ Biển Falcon và Đỉnh Lời Thề tạo nên lục địa với ba mặt giáp biển, bao lấy bờ biển phía đông Mondstadt.Với đường bờ biển trải dài và dòng nước nông, người dân Mondstadt thường chọn đây làm điểm nghỉ dưỡng. Thi thoảng có thể bắt những chú chim ưng bay lượn phía trên làn sóng xanh và bãi cát trắng.",
        img: "Genshin_country.img/Monstard2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Đỉnh Lời Thề",
        desc: "Nằm giữa góc đông nam Thành Mondstadt và rìa Đồi Phong Tiêu.Tương truyền xưa kia có một đôi tình nhân từng lập lời thề nơi đây và để lại câu chuyện cảm động. Ngày nay, nó vẫn được coi là địa điểm lý tưởng cho các cặp tình nhân.Nhờ địa thế, ngoài việc có thể ngắm nhìn bình minh và hoàng hôn, còn có thể nhìn thấy Phong Khởi Địa nằm đối diện eo biển một cách dễ dàng.",
        img: "Genshin_country.img/Monstard3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Tửu Trang Dawn",
        desc: "Tửu Trang Dawn nằm phía tây nam Thành Mondstadt, nơi kế thừa ngành ủ rượu truyền thống Mondstadt nhiều đời nay.Tại đây, nho và các loại cây trồng khác được trồng với diện tích lớn, nhằm phục vụ cho việc tạo ra nhiều loại rượu cung cấp cho cả đại lục Teyvat.Hàng năm, lượng rượu mà Tửu Trang Dawn sản xuất ra, một phần được tiêu thụ tại Thành Mondstadt, một phần được đem bán ra bên ngoài thông qua con đường giao thương phía nam thành.",
        img: "Genshin_country.img/Monstard4.png", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Thanh Tuyền Trấn",
        desc: "Là một thị trấn yên bình nằm phía nam, chia cách với thành Mondstadt bởi một hồ nước.Cư dân nơi đây sinh sống chủ yếu bằng nghề săn bắt, quanh năm cung cấp lượng thịt tươi ngon cho các nhà hàng tại Thành Mondstadt.",
        img: "Genshin_country.img/Monstard5.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Thiên Phong Thần Điện",
        desc: "Là quần thể di tích thần điện nằm phía đông bắc Mondstadt.Theo tương truyền, hàng trăm ngàn năm trước từng là thần điện dùng để hiến tế cho Phong Thần cổ đại, đến nay chịu ảnh hưởng của thời gian chỉ còn lại một đống phế tích. Một vài cột đá vẫn có thể nhận ra những đường cong tinh tế đã từng được chạm khắc tuyệt đẹp.",
        img: "Genshin_country.img/Monstard 6.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  liyue: {
    name: "Liyue",
    spots: [
      {
        title: "Cảng khẩu",
        desc: "Sự thành lập cảng đã đặt nền tảng ban đầu cho thương mại hàng hải của Liyue. Là cảng thương mại lớn nhất trên lục địa Teyvat, lưu lượng hàng hóa của nó không một cảng thông thường nào có thể sánh bằng.",
        img: "Genshin_country.img/Liyue1.png",
      },
      {
        title: "Địch Hoa Châu",
        desc: "Địch Hoa Châu được đặt theo tên loài hoa mọc khắp vùng nước cạn, nơi đây cũng là vùng đất ngập nước tự nhiên phía Bắc Liyue.Mạng lưới sông hồ trải dài tạo nên hệ động thực vật vô cùng phong phú, trở thành một cảnh quan tuyệt vời cho các du khách đến nơi đây.",
        img: "Genshin_country.img/Liyue2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Nhà Trọ Vọng Thư",
        desc: "Cột mốc của Địch Hoa Châu, quán trọ được xây dựng trên một cột đá khổng lồ.Đến đây nghỉ ngơi hầu hết là những tiểu thương đi ngang, nhà trọ cũng cung cấp khu vực giao dịch trực tiếp và các quầy hàng. Vị trí trên cao có tầm nhìn tuyệt vời.",
        img: "Genshin_country.img/Liyue 3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Khinh Sách Trang",
        desc: "Tọa lạc ở phía cực bắc Liyue, một ngôi làng ẩn nấp giữa những ngọn đồi và rừng trúc.Thung lũng được bao quanh bởi những đám mây trắng và điểm xuyết bởi dãy ruộng bậc thang hình bán nguyệt, khi gió núi thổi qua có thể nhìn thấy những tầng mây gợn sóng đầy màu sắc.",
        img: "Genshin_country.img/Liyue 4.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  inazuma: {
    name: "Inazuma",
    spots: [
      {
        title: "Thành Inazuma",
        desc: "Inazuma là khu vực phồn hoa náo nhiệt nhất, người Inazuma đa số đều sống ở đây. Có thể đi dọc theo con đường từ Hanamizaka đến phố thị, dạo chơi những cửa tiệm truyền thống địa phương, nếm thử món ăn đặc sắc của Inazuma.",
        img: "Genshin_country.img/Inazuma1.jpg",
      },
      {
        title: "Rừng Chinju",
        desc: "Nằm dưới chân núi Yougou, một khu rừng yên tĩnh và bí ẩn.Tượng đá Tanuki có thể nhìn thấy ở khắp mọi nơi, cổng Torri nằm rải rác khắp khu rừng, và ngôi miếu bỏ hoang lẩn khuất sâu trong đó...",
        img: "Genshin_country.img/Inazuma2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Đầu Thần Rắn",
        desc: "Mãng Xà bị Lưỡi Đao Vô Tưởng của Lôi Thần trảm sát, nay chỉ còn lại bộ xương khô. Mặc dù vẫn ngẩng đầu lên trời không chịu khuất phục, nhưng Ma Thần đã bị tiêu diệt, danh hiệu Watatsumi Omikami cũng không còn vang vọng nữa.",
        img: "Genshin_country.img/Inazuma3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Đền Narukami",
        desc: "Ngôi đền lớn nhất Inazuma, nằm trên đỉnh núi Yougou, thờ phụng Tôn Chủ Narukami Ogosho.",
        img: "Genshin_country.img/Inazuma4.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  sumeru: {
    name: "Sumeru",
    spots: [
      {
        title: "Thành Sumeru",
        desc: "Nơi hội tụ tất cả trí tuệ trên mặt đất. Bên dưới Cây Thánh cành lá sum suê, các hiền giả của thành phố học thức đã ghi nhận tất cả tri thức. Hoan nghênh đến với Sumeru, người lữ khách đi tìm đáp án.",
        img: "Genshin_country.img/Sumeru1.jpg",
      },
      {
        title: "Rừng Mawtiyima",
        desc: "Khu rừng nấm khổng lồ lấp lánh huỳnh quang. Những tán nấm khổng lồ phát ra thứ ánh sáng mờ ảo, che khuất cả mặt trời lẫn mặt trăng, đây là thiên đường do con người tạo ra, hay một khu vườn đang chờ nở hoa.",
        img: "Genshin_country.img/Sumeru2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Núi Devantaka",
        desc: "Ngọn núi chứng kiến ma vật suy sụp. Cỗ máy khổng lồ nằm giữa núi rừng và rêu xanh, sau khi mất đi ánh sáng thì đã không còn cất tiếng. Những lỗ tròn tựa như đôi mắt, dõi theo những biến động của lịch sử.",
        img: "Genshin_country.img/Sumeru3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  fontaine: {
    name: "Fontaine",
    spots: [
      {
        title: "Đại Sảnh Fontaine",
        desc: "Bên trên mọi dòng nước, chỉ có thành phố này.",
        img: "Genshin_country.img/Fontaine1.jpg",
      },
      {
        title: "Cảng Romaritime",
        desc: "Âm thanh của thác nước cuồn cuộn át đi tiếng dòng người ra vào cảng. Muốn lên đến được đỉnh thác nước, ngay cả khi có sự hỗ trợ của thang máy thì cũng vẫn phải tốn không ít thời gian.",
        img: "Genshin_country.img/Fontaine2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Viện Ca Kịch Epiclese",
        desc: "Viện ca kịch lớn nằm ở Đảo Erinnyes, đồng thời cũng là biểu tượng cho xét xử và phán quyết. Chân thực và hư ảo, hài kịch và bi kịch cũng được trình diễn công bằng tại đây",
        img: "Genshin_country.img/Fontaine3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Đại Dương Salacia",
        desc: "Sức mạnh thần kỳ tuôn ra từ thần tượng, ban cho Nhà Lữ Hành sự chúc phúc của nước nguồn xa lạ.",
        img: "Genshin_country.img/Fontaine4.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  natlan: {
    name: "Natlan",
    spots: [
      {
        title: "Lòng Chảo Vạn Hỏa",
        desc: "Ở nơi này, hãy thắp lên ngọn lửa tranh đấu vì thắng lợi và vinh quang đi! Sau đó, sức nóng của mọi linh hồn, đều sẽ hóa thành bó củi giữ cho Lửa Thánh bừng sáng mãi.",
        img: "Genshin_country.img/Natlan1.jpg",
      },
      {
        title: "Suối Nguồn Toyac",
        desc: "Bộ tộc chung sống cùng Koholasaurus, cái tên Cư Dân Suối Nước nổi tiếng với suối nước nóng và âm nhạc dễ chịu. Trong các bộ tộc, chỉ có nơi đây là được du khách nước ngoài yêu thích nhất.",
        img: "Genshin_country.img/Natlan2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Thánh Địa Nổi",
        desc: "Tịnh thổ bị chôn giấu giữa không trung với cánh cửa khép chặt. Từng có vị hiền nhân xót thương mọi thứ đã truyền thụ bí pháp cho nhân vật vĩ đại.",
        img: "Genshin_country.img/Natlan3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
  snezhnaya: {
    name: "Snezhnaya",
    spots: [
      {
        title: "Cung Điện Băng Tuyết Sao Cực",
        desc: "Không ai hay biết suy nghĩ của nữ chủ nhân trên ngai vàng trong cung điện đúc từ băng tuyết kia. Có lẽ thỉnh thoảng người ấy cũng sẽ đứng trên gác cao của cung điện, muốn thu trọn cả quảng trường, thậm chí là cả thế giới vào trong tầm mắt.",
        img: "Genshin_country.img/Snezhnaya1.png",
      },
      {
        title: "Thành Lũy Của Những Kẻ Ngốc",
        desc: "Có lẽ chỉ có những kẻ ngốc thực sự mới muốn lật đổ sự thống trị của bầu trời. Nhưng cũng chỉ có những kẻ ngốc ấy mới mang trong mình hoài bão và lòng dũng cảm như vậy.",
        img: "Genshin_country.img/Snezhnaya2.png", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Nơi Tuyết Vùi Vương Miện",
        desc: "Nơi đây vừa là cung điện, vừa là phế tích. Đây là nơi vị hoàng đế thuở xưa ban hành mệnh lệnh, cũng là nơi quy tụ hài cốt của ngài.",
        img: "Genshin_country.img/Snezhnaya5.png", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Chân Núi Nơi Tiếng Sấm Xa Tựa Băng Ngưng",
        desc: "Nếu nguyện vọng muốn níu giữ điều gì đó quá mãnh liệt, có lẽ ngay cả sấm sét giáng xuống từ trên mây cũng sẽ vì thế mà dừng bước.",
        img: "Genshin_country.img/Snezhnaya6.png", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
      {
        title: "Tượng nữ thần mặt trăng",
        desc: "Nơi bộ tộc tôn thờ.",
        img: "Genshin_country.img/Nod_Krai1.jpg",
      },
      {
        title: "Pháo Đài Thép Đúc",
        desc: "Cự thú được đúc từ sắt trắng và thép đen, vội vàng nuốt chửng mọi thứ trong tầm mắt, dù là năng lượng hay là máu thịt nước mắt.",
        img: "Genshin_country.img/Nod_Krai2.jpg", // Thay tên ảnh Bờ Biển Falcon của bạn
      },
      {
        title: "Giấc mơ cá voi sắt",
        desc: "Trái tim cấu thành từ bánh răng khổng lồ đã ngừng đập từ lâu, mạch máu sắt thép cũng đã gỉ sét. Cho đến khi ai đó đánh thức nó từ giấc mộng, con thú khổng lồ hướng về phía bầu trời sao thở ra một hơi dài tựa dải lụa rực rỡ.",
        img: "Genshin_country.img/Nod_Krai3.jpg", // Thay tên ảnh Đồi Phong Tiêu của bạn
      },
    ],
  },
};

// ==========================================================
// TỰ ĐỘNG DỰNG TOÀN BỘ ĐỊA DANH VÀO TRONG KHUNG POPUP
// ==========================================================
const nationInfoModal = document.getElementById("nationInfoModal");
const closeNationInfoBtn = document.getElementById("closeNationInfoBtn");
const modalNationName = document.getElementById("modalNationName");
const modalNationBody = document.querySelector(".modal-nation-body");

document.addEventListener("click", function (e) {
  const button = e.target.closest(".open-journey-btn");

  if (button) {
    e.preventDefault();
    e.stopPropagation(); // QUAN TRỌNG: Chặn không cho mở trang Nhân Vật khi bấm nút này

    let rawNation = button.getAttribute("data-nation") || "";
    let nationKey = rawNation.toLowerCase().replace(/\s+/g, "");

    // Lấy dữ liệu quốc gia (Mặc định về mondstadt nếu không tìm thấy key)
    const data = nationDetailsData[nationKey] || nationDetailsData["mondstadt"];

    if (nationInfoModal && data) {
      // 1. Cập nhật tên quốc gia trên cùng
      if (modalNationName) modalNationName.textContent = data.name;

      // 2. Xóa sạch nội dung cũ trong khung
      if (modalNationBody) modalNationBody.innerHTML = "";

      // 3. Tự động nạp từng địa danh (Tiêu đề + Lời dẫn + Ảnh)
      data.spots.forEach((spot) => {
        const spotHTML = `
                    <div class="spot-block">
                        <h2>${spot.title}</h2>
                        <div class="spot-title-line"></div>
                        <p>${spot.desc}</p>
                        <div class="modal-spot-img-box">
                            <img src="${spot.img}" alt="${spot.title}" onerror="this.src='./Genshin.img/mondstadt.jpg'">
                        </div>
                    </div>
                `;
        if (modalNationBody) {
          modalNationBody.insertAdjacentHTML("beforeend", spotHTML);
        }
      });

      // 4. Mở Popup và cuộn lên đầu
      nationInfoModal.style.display = "flex";
      nationInfoModal.classList.add("open");
      if (modalNationBody) modalNationBody.scrollTop = 0;
    }
  }
});

// Đóng Modal khi bấm dấu X
if (closeNationInfoBtn && nationInfoModal) {
  closeNationInfoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nationInfoModal.style.display = "none";
    nationInfoModal.classList.remove("open");
  });
}

// Đóng Modal khi bấm ra ngoài vùng đen mờ
if (nationInfoModal) {
  nationInfoModal.addEventListener("click", (e) => {
    if (e.target === nationInfoModal) {
      nationInfoModal.style.display = "none";
      nationInfoModal.classList.remove("open");
    }
  });
}
// ==========================================================
// XỬ LÝ BẤM "XEM CHI TIẾT" MỞ TRANG NỘI DUNG TIN TỨC
// ==========================================================
const newsDetailPage = document.getElementById("news-detail-page");
const backToNewsBtn = document.getElementById("backToNewsBtn");
const breadcrumbHome = document.getElementById("breadcrumbHome");
const breadcrumbNews = document.getElementById("breadcrumbNews");

const detailTitle = document.getElementById("detailTitle");
const detailDate = document.getElementById("detailDate");
const detailCategoryTag = document.getElementById("detailCategoryTag");
const detailBreadcrumbTitle = document.getElementById("detailBreadcrumbTitle");
const detailBannerImg = document.getElementById("detailBannerImg");
const detailDescText = document.getElementById("detailDescText");

document.addEventListener("click", (e) => {
  const readMoreBtn = e.target.closest(
    ".news-read-more, .news-page-card, .news-item",
  );

  if (readMoreBtn && !e.target.closest("#news-detail-page")) {
    e.preventDefault();

    const card = e.target.closest(
      ".news-page-card, .news-list-item, .news-item",
    );
    if (!card) return;

    const title =
      card.querySelector("h3, .news-item-title")?.innerText ||
      "Tin tức Genshin Impact";
    const date =
      card.querySelector(".news-card-date, .news-item-date, .date")
        ?.innerText || "06/10/2026";
    const category =
      card.querySelector(".news-card-tag, .news-item-tag, .tag")?.innerText ||
      "Thông tin";
    const imgSrc =
      card.querySelector("img")?.src || "./Genshin_News.img/Thong_tin1.jpg";
    const desc =
      card.querySelector("p, .news-item-desc")?.innerText ||
      "Nội dung chi tiết bài viết đang được cập nhật...";

    if (detailTitle) detailTitle.innerText = title;
    if (detailDate) detailDate.innerText = date;
    if (detailCategoryTag) detailCategoryTag.innerText = category;
    if (detailBreadcrumbTitle) detailBreadcrumbTitle.innerText = title;
    if (detailBannerImg) detailBannerImg.src = imgSrc;
    if (detailDescText) detailDescText.innerText = desc;

    if (homePage) homePage.classList.remove("active");
    if (newsPage) newsPage.classList.remove("active");
    if (newsDetailPage) newsDetailPage.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function returnToNewsList(e) {
  if (e) e.preventDefault();
  if (newsDetailPage) newsDetailPage.classList.remove("active");
  if (newsPage) newsPage.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (backToNewsBtn) backToNewsBtn.addEventListener("click", returnToNewsList);
if (breadcrumbNews) breadcrumbNews.addEventListener("click", returnToNewsList);

if (breadcrumbHome) {
  breadcrumbHome.addEventListener("click", (e) => {
    e.preventDefault();
    if (newsDetailPage) newsDetailPage.classList.remove("active");
    if (newsPage) newsPage.classList.remove("active");
    if (homePage) homePage.classList.add("active");

    if (navNews) navNews.classList.remove("active");
    if (navHome) navHome.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
// ==========================================================
// XỬ LÝ CHUYỂN ẢNH SLIDER ĐỒ HỌA
// ==========================================================

// 1. Danh sách các ảnh đồ họa (dựa trên các file trong thư mục Genshin.img của bạn)
const graphicsList = [
  "Gioi_Thieu_game.img/Do_hoa1.png",
  "Gioi_Thieu_game.img/Do_hoa2.png",
  "Gioi_Thieu_game.img/Do_hoa3.png",
  "Gioi_Thieu_game.img/Do_hoa4.png",
];

let currentGraphicsIndex = 0;

const graphicsImg = document.getElementById("graphicsCurrentImg");
const prevBtn = document.getElementById("graphicsPrevBtn");
const nextBtn = document.getElementById("graphicsNextBtn");

if (graphicsImg && prevBtn && nextBtn) {
  // Bấm nút MŨI TÊN TRÁI (Lùi ảnh)
  prevBtn.addEventListener("click", () => {
    currentGraphicsIndex--;
    if (currentGraphicsIndex < 0) {
      currentGraphicsIndex = graphicsList.length - 1; // Lùi về ảnh cuối nếu đang ở ảnh đầu
    }
    graphicsImg.src = graphicsList[currentGraphicsIndex];
  });

  // Bấm nút MŨI TÊN PHẢI (Tiến ảnh)
  nextBtn.addEventListener("click", () => {
    currentGraphicsIndex++;
    if (currentGraphicsIndex >= graphicsList.length) {
      currentGraphicsIndex = 0; // Quay về ảnh đầu nếu đã đến ảnh cuối
    }
    graphicsImg.src = graphicsList[currentGraphicsIndex];
  });
}

// ==========================================================
// IV. XỬ LÝ DỮ LIỆU VÀ TƯƠNG TÁC TRANG NHÂN VẬT (CHARACTERS)
// ==========================================================

// 1. Kho dữ liệu Nhân Vật của 7 Quốc Gia (Mỗi nước 3 nhân vật)
const charactersData = {
  mondstadt: {
    bg: "Nhan_vat.img/Monstard_BG.png",
    chars: [
      {
        name: "VENTI",
        desc: "Nhà Thơ có lai lịch không rõ ràng, có lúc cất lên những lời thơ cũ kỹ, có khi lại hát những bài hát mà chưa ai từng nghe. Thích táo và không khí náo nhiệt, ghét phô mai cùng những thứ dinh dính. Khi dẫn dắt nguyên tố - Phong, nguyên tố thường có hình dạng lông vũ, bởi cậu ấy thích nhìn những thứ bay nhẹ nhàng.",
        img: "Genshin.img/Venti_Monstard.png",
        avatar: "Nhan_vat.img/avarta_Venti.png",
      },
      {
        name: "KLEE",
        desc: "Đội Kỵ Sĩ Tây Phong, Kỵ Sĩ Tia Lửa! Luôn song hành cùng ánh sáng và bùng nổ! ——Sau đó dần biến mất dưới ánh mắt đầy nghiêm khắc của đội trưởng Jean. ",
        img: "Nhan_vat.img/Klee.png",
        avatar: "Nhan_vat.img/avatar_Klee.png",
      },
      {
        name: "NICOLE",
        desc: "Ma nữ N, Nicole Reeyn. Tóm lại... sẽ là người quan sát thế giới",
        img: "Nhan_vat.img/Nicole.png",
        avatar: "Nhan_vat.img/Avatar_nicole.png",
      },
    ],
  },
  liyue: {
    bg: "Nhan_vat.img/Liyue_BG.png",
    chars: [
      {
        name: "ZHONGLI",
        desc: "Vị khách bí ẩn của Vãng Sinh Đường. Anh ta có vẻ bề ngoài khôi ngô tuấn tú, phong độ lịch lãm và sở hữu kiến thức vượt xa người thường.",
        img: "./Genshin.img/Zhongli_Liyue.png",
        avatar: "Nhan_vat.img/Avatar_Zongli.png",
      },
      {
        name: "HUTAO",
        desc: "Hu Tao - Đường chủ đời thứ 77 của Vãng Sinh Đường, nhân vật quan trọng phụ trách tang lễ của Liyue.",
        img: "Nhan_vat.img/Hutao.png",
        avatar: "Nhan_vat.img/Avatar_Hutao.png",
      },
      {
        name: "ZIBAI",
        desc: "Bạch Mã Tiên Nhân trong truyền thuyết Liyue, tên Zibai, là nhân vật thần bí nhất trong những câu chuyện tiên nhân ở Liyue.",
        img: "Nhan_vat.img/Zibai.png",
        avatar: "Nhan_vat.img/Avatar_Zibai.png",
      },
    ],
  },
  inazuma: {
    bg: "Nhan_vat.img/Inazuma_BG.png",
    chars: [
      {
        name: "RAIDEN SHOGUN",
        desc: "Raiden Shogun là hoá thân đáng sợ nhất của sấm sét trên thế giới này, cũng là chúa tể tối cao của Inazuma Shogunate.",
        img: "Genshin.img/Raiden Shogun_Inazuma.png",
        avatar: "Nhan_vat.img/Avatar_RaidenShogun.png",
      },
      {
        name: "KAMISATO AYAKA",
        desc: "Đại tiểu thư nhà Kamisato thuộc Hiệp Hội Yashiro Inazuma. Đoan trang thanh lịch, thông minh và mạnh mẽ.",
        img: "Nhan_vat.img/Azaka.png",
        avatar: "Nhan_vat.img/Avatar_azaka.png",
      },
      {
        name: "KAZUHA",
        desc: "Ronin Samurai đến từ Inazuma. Con người khiêm tốn có tính cách hoà nhã.",
        img: "Nhan_vat.img/Kazuha.png",
        avatar: "Nhan_vat.img/Avatar_Kazuha.png",
      },
    ],
  },
  sumeru: {
    bg: "Nhan_vat.img/Sumeru_BG.png",
    chars: [
      {
        name: "NAHIDA",
        desc: "Tiểu Vương Kusanali sống trong Thánh Địa Surasthana, không được xem trọng và cũng ít người nhắc đến.",
        img: "Genshin.img/nahida_Sumeru.png",
        avatar: "Nhan_vat.img/Avatar_nahida.png",
      },
      {
        name: "NILOU",
        desc: "Ngôi sao của Nhà Hát Zubayr, dáng múa uyển chuyển, giống như đóa sen mới nở, không nhuốm bụi trần.",
        img: "Nhan_vat.img/Nilou.png",
        avatar: "Nhan_vat.img/Avatar_nilou.png",
      },
      {
        name: "KẺ LANG THANG",
        desc: "Nếu người có trái tim là con người, thì anh ta không thể được gọi là con người.",
        img: "Nhan_vat.img/langthang.png",
        avatar: "Nhan_vat.img/Avatar_Langthang.png",
      },
    ],
  },
  fontaine: {
    bg: "Nhan_vat.img/Fontaine_BG.png",
    chars: [
      {
        name: "NEUVILLETTE",
        desc: "Vị thẩm phán tối cao của Fontaine, trông có vẻ khó gần, có lẽ là bẩm sinh đã thế, hoặc vì để che giấu bí mật.",
        img: "Nhan_vat.img/Neuvillet.png",
        avatar: "Nhan_vat.img/Avatar_Neuvillet.png",
      },
      {
        name: "FURINA",
        desc: "Nữ hoàng của muôn nước, muôn nơi, muôn dân và muôn luật lệ, rất được dân chúng yêu thích.",
        img: "./Genshin.img/Furina_Fontaine.png",
        avatar: "Nhan_vat.img/Avatar_Furina.png",
      },
      {
        name: "NAVIA",
        desc: "Hội trưởng Spina di Rosula luôn nở nụ cười rực rỡ, cố gắng giúp đỡ người dân Fontaine xử lý các vấn đề nan giải.",
        img: "Nhan_vat.img/Navia.png",
        avatar: "Nhan_vat.img/Avatar_Navia.png",
      },
    ],
  },
  natlan: {
    bg: "Nhan_vat.img/Natlan_BG.jpg",
    chars: [
      {
        name: "MAVUIKA",
        desc: "Thần linh và lãnh đạo của Natlan, ngọn lửa vĩnh hằng mang lại hy vọng cho mọi sinh vật, ngọn lửa thiêu rụi khiến mọi tội ác phải run sợ.",
        img: "Genshin.img/Mavuika_Natlan.png",
        avatar: "Nhan_vat.img/Avatar_Mavuika.png",
      },
      {
        name: "CITLALI",
        desc: "Shaman huyền thoại của Chủ Nhân Gió Đêm, Bà Itztli nổi danh khắp Natlan. Là nhân vật tuyệt đối không nên chọc giận, nhưng cũng là đối tượng tốt nhất để nhờ giúp đỡ khi gặp vấn đề khó khăn.",
        img: "Nhan_vat.img/Citlali.png",
        avatar: "Nhan_vat.img/Avatar_citlali.png",
      },
      {
        name: "SKIRK",
        desc: "Chiến binh mạnh mẽ không rõ lai lịch, tự xưng là đệ tử của một trong năm tội nhân Khaenri'ah, Kỵ Sĩ Cực Ác Surtalogi, đồng thời cũng là sư phụ của Childe Tartaglia.",
        img: "Nhan_vat.img/Skirt.png",
        avatar: "Nhan_vat.img/Avatar_skirt.png",
      },
    ],
  },
  snezhnaya: {
    bg: "Nhan_vat.img/Snezhnaya_BG.jpg",
    chars: [
      {
        name: "COLUMBINA HYPOSELENIA",
        desc: "Kuutar, Nguyệt Thần của Nod-Krai, Columbina, cựu Quan Chấp Hành thứ ba của Fatui... Nhưng bạn bè đều gọi cô là Columbina Hyposelenia, và cô thích cái tên này hơn.",
        img: "Genshin.img/Columbina_Nod Krai.png",
        avatar: "Nhan_vat.img/Avatar_Columbina.png",
      },
      {
        name: "ODETTE",
        desc: "Vũ công ba lê hàng đầu của Đoàn Kịch Korolevskiy, trong trẻo và cứng rắn như tảng băng lạnh giá.",
        img: "Nhan_vat.img/odette.png",
        avatar: "Nhan_vat.img/Avatar_Odet.png",
      },
      {
        name: "VODYANITSA",
        desc: "Nữ giọng cao hàng đầu của Đoàn Kịch Korolevskiy, một thủy yêu đơn độc.",
        img: "Nhan_vat.img/Vodtanitsa.png",
        avatar: "Nhan_vat.img/Avatar_Vodnalisa.png",
      },
    ],
  },
};

let currentRegionKey = "mondstadt";
let currentCharIdx = 0;

// 2. Hàm Cập nhật giao diện Nhân vật theo Quốc gia & Vị trí Nhân vật
function updateCharacterDisplay(regionKey, charIdx = 0) {
  const regionData = charactersData[regionKey] || charactersData["mondstadt"];
  currentRegionKey = regionKey;
  currentCharIdx = charIdx;

  const char = regionData.chars[charIdx] || regionData.chars[0];

  // Cập nhật Background trang
  const charPage = document.getElementById("characters-page");
  if (charPage && regionData.bg) {
    charPage.style.backgroundImage = `url('${regionData.bg}')`;
    charPage.style.backgroundSize = "cover"; /* THÊM DÒNG NÀY */
    charPage.style.backgroundPosition = "center center"; /* THÊM DÒNG NÀY */
  }

  // Cập nhật Tên và Mô tả
  const charName = document.getElementById("charName");
  const charDesc = document.getElementById("charDesc");
  const charSplashImg = document.getElementById("charSplashImg");

  if (charName) charName.textContent = char.name;
  if (charDesc) charDesc.textContent = char.desc;
  if (charSplashImg) {
    charSplashImg.style.opacity = "0";
    setTimeout(() => {
      charSplashImg.src = char.img;
      charSplashImg.style.opacity = "1";
    }, 150);
  }

  // Cập nhật Danh sách 3 Avatar ở đáy
  const avatarContainer = document.getElementById("avatarListContainer");
  if (avatarContainer) {
    avatarContainer.innerHTML = "";
    regionData.chars.forEach((c, index) => {
      const avatarCard = document.createElement("div");
      avatarCard.className = `char-avatar-card ${index === charIdx ? "active" : ""}`;
      avatarCard.setAttribute("data-char-id", index);
      avatarCard.innerHTML = `
      <img src="${c.avatar || c.img}" alt="${c.name}">
      <span class="char-name-label">${c.name}</span>`;

      avatarCard.addEventListener("click", () => {
        // 1. Tìm thẻ ảnh nhân vật lớn chính ở trang Nhân vật
        const mainCharImg =
          document.querySelector("#characters-page img") ||
          document.querySelector(".character-main-img");

        if (mainCharImg) {
          // 2. Làm mờ ảnh cũ đi
          mainCharImg.classList.add("fade-out");

          // 3. Đợi 150ms mờ hẳn rồi mới đổi dữ liệu nhân vật mới
          setTimeout(() => {
            updateCharacterDisplay(regionKey, index);
            // 4. Hiện ảnh mới lên mượt mà
            mainCharImg.classList.remove("fade-out");
          }, 150);
        } else {
          updateCharacterDisplay(regionKey, index);
        }
      });

      avatarContainer.appendChild(avatarCard);
    });
  }

  // Cập nhật trạng thái Active trên Menu Quốc gia bên trái
  document.querySelectorAll(".nation-nav-item").forEach((item) => {
    if (item.getAttribute("data-region") === regionKey) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// 3. Hàm Điều hướng thông minh sang Trang Nhân Vật
window.openCharacterPageWithRegion = function (regionKey = "mondstadt") {
  const charactersPage = document.getElementById("characters-page");
  const navExplore = document.getElementById("navExplore");

  // Chuyển trang SPA
  if (typeof switchPage === "function" && charactersPage) {
    switchPage(charactersPage, navExplore);
  }

  // Kích hoạt quốc gia tương ứng
  updateCharacterDisplay(regionKey, 0);
};

// 4. Lắng nghe click Menu Quốc gia bên trái Sidebar
document.querySelectorAll(".nation-nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const region = item.getAttribute("data-region");
    updateCharacterDisplay(region, 0);
  });
});

// 5. Bấm vào cả Ô Quốc Gia -> Sang Trang Nhân Vật | Bấm nút Xem Chi Tiết -> Mở Bảng Giới Thiệu
document.querySelectorAll(".nation-card").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    const btn = card.querySelector(".open-journey-btn");
    const nation = btn ? btn.getAttribute("data-nation") : "mondstadt";
    if (typeof openCharacterPageWithRegion === "function") {
      openCharacterPageWithRegion(nation);
    }
  });
});

document.querySelectorAll(".open-journey-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Chặn không cho mở trang Nhân Vật

    const rawNation = btn.getAttribute("data-nation") || "mondstadt";
    const nationKey = rawNation.toLowerCase().replace(/\s+/g, "");

    // 1. Lấy khung Modal và các phần tử chứa chữ/ảnh bên trong
    const modal = document.getElementById("nationInfoModal");
    const modalNationName = document.getElementById("modalNationName");
    const modalNationBody = document.querySelector(".modal-nation-body");

    // 2. Lấy bộ dữ liệu từ kho nationDetailsData đã khai báo ở trên
    const data =
      typeof nationDetailsData !== "undefined"
        ? nationDetailsData[nationKey]
        : null;

    if (modal) {
      if (data) {
        // Cập nhật tên Quốc Gia phía trên cùng
        if (modalNationName) modalNationName.textContent = data.name;

        // Nạp danh sách các địa danh (Tiêu đề, Lời dẫn, Ảnh)
        if (modalNationBody && data.spots) {
          modalNationBody.innerHTML = ""; // Xóa nội dung cũ
          data.spots.forEach((spot) => {
            const spotHTML = `
                                <div class="spot-block">
                                    <h2>${spot.title}</h2>
                                    <div class="spot-title-line"></div>
                                    <p>${spot.desc}</p>
                                    <div class="modal-spot-img-box">
                                        <img src="${spot.img}" alt="${spot.title}" onerror="this.src='./Genshin.img/mondstadt.jpg'">
                                    </div>
                                </div>
                            `;
            modalNationBody.insertAdjacentHTML("beforeend", spotHTML);
          });
          modalNationBody.scrollTop = 0; // Cuộn khung về đầu trang
        }
      }

      // 3. Bật hiển thị Modal
      modal.style.display = "flex";
    }
  });
});
// C. XỬ LÝ ĐÓNG BẢNG POPUP (MODAL)
const closeModalBtn = document.getElementById("closeNationInfoBtn");
const nationModal = document.getElementById("nationInfoModal");

if (closeModalBtn && nationModal) {
  // Cách 1: Bấm trực tiếp vào nút dấu X
  closeModalBtn.addEventListener("click", () => {
    nationModal.style.display = "none";
  });

  // Cách 2: Bấm ra ngoài vùng hộp thoại (phần nền đen mờ) để tắt
  nationModal.addEventListener("click", (e) => {
    if (e.target === nationModal) {
      nationModal.style.display = "none";
    }
  });
}
// 6. Kết nối nút "Xem Nhân Vật" ở phần Khám Phá & Menu Dropdown Nhân Vật
const btnGoToCharacters = document.getElementById("btnGoToCharacters");
if (btnGoToCharacters) {
  btnGoToCharacters.addEventListener("click", (e) => {
    e.preventDefault();
    openCharacterPageWithRegion("mondstadt");
  });
}

const dropdownCharLink = document.querySelector(
  '.dropdown-item[href="#characters"]',
);
if (dropdownCharLink) {
  dropdownCharLink.addEventListener("click", (e) => {
    e.preventDefault();
    openCharacterPageWithRegion("mondstadt");
  });
}

// ==========================================================
// [QUAN TRỌNG]. CHUYỂN TRANG MƯỢT GIỮA CÁC SECTION
// ==========================================================
// 1. Khai báo các trang và nút bấm Menu
const navHome = document.getElementById("navHome");
const navNews = document.getElementById("navNews");
const navExplore = document.getElementById("navExplore");
const btnIntroGame = document.getElementById("btnIntroGame");
const navVideo = document.getElementById("navVideo");
const navGift = document.getElementById("navGift");

const homePage = document.getElementById("home-page");
const newsPage = document.getElementById("news-page");
const gameIntroPage = document.getElementById("game-intro-page");
const videoPage = document.getElementById("video-page");
const giftPage = document.getElementById("gift-page");

// 2. HÀM ĐẠO DIỄN CHUYỂN TRANG CHUẨN SPA (Tắt sạch trang cũ, bật duy nhất trang mới)
function switchPage(targetPage, activeNavLink) {
  document
    .querySelectorAll(".page-section")
    .forEach((sec) => sec.classList.remove("active"));
  if (targetPage) targetPage.classList.add("active");

  document
    .querySelectorAll(".nav-menu a, .dropdown-item")
    .forEach((link) => link.classList.remove("active"));
  if (activeNavLink) activeNavLink.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 3. Gắn sự kiện cho từng nút bấm
if (navHome) {
  navHome.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(homePage, navHome);
  });
}

if (navNews) {
  navNews.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(newsPage, navNews);
  });
}

if (btnIntroGame) {
  btnIntroGame.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(gameIntroPage, navExplore);
  });
}
if (navVideo) {
  navVideo.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(videoPage, navVideo);
  });
}
if (navGift) {
  navGift.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(giftPage, navGift);
  });
}

// ==========================================================
// THU THẬP EMAIL QUA WEB3FORMS
// ==========================================================
const subscribeForm = document.getElementById("subscribe-form");

if (subscribeForm) {
  subscribeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("btn-subscribe");
    const originalBtnText = submitBtn ? submitBtn.textContent : "Theo Dõi Ngay";
    const emailInput = document.getElementById("email-input");
    const emailValue = emailInput ? emailInput.value.trim() : "";

    if (!emailValue) {
      alert("Vui lòng nhập địa chỉ Email!");
      return;
    }

    if (submitBtn) {
      submitBtn.textContent = "Đang gửi...";
      submitBtn.disabled = true;
    }

    // Gửi dữ liệu chuẩn bằng JSON
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "940986ed-0914-4b60-bf3e-67464e4a8e24", // Dán mã vừa copy vào đây
        email: emailValue,
        from_name: "Web Genshin Impact",
        subject: "Có người dùng mới đăng ký Email!",
      }),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          alert("🎉 Cảm ơn bạn đã đăng ký nhận thông tin thành công!");
          subscribeForm.reset();
        } else {
          alert("Lỗi: " + json.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi gửi email:", error);
        alert("Đã có lỗi xảy ra, vui lòng thử lại!");
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      });
  });
}
