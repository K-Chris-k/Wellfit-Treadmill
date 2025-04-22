class BikeCatalog {
  constructor(container) {
    this.container = container;
    this.sectionId = container.dataset.sectionId;
    this.products = this.container.querySelectorAll('.product-card');
    this.currentCategory = 'all';
    this.init();
  }

  init() {
    this.initializeVariants();
    this.bindEvents();
    this.initializeImageHover();
    this.filterProducts('all');
    this.initJudgemeReviews();
  }

  initializeVariants() {
    this.products.forEach(product => {
      const firstVariantButton = product.querySelector('.variant-image-button');
      if (firstVariantButton) {
        firstVariantButton.classList.add('variant-image-button--active');
        
        const mainImage = product.querySelector('.product-card__image-main');
        const hoverImage = product.querySelector('.product-card__image-hover');
        const priceContainer = product.querySelector('.product-card__pricing');

        if (firstVariantButton.dataset.variantImage) {
          mainImage.src = firstVariantButton.dataset.variantImage;
          mainImage.alt = firstVariantButton.dataset.variantImageAlt;
        }
        if (firstVariantButton.dataset.variantHoverImage) {
          hoverImage.src = firstVariantButton.dataset.variantHoverImage;
          hoverImage.alt = firstVariantButton.dataset.variantHoverImageAlt;
        }

        const price = firstVariantButton.dataset.variantPrice;
        const comparePrice = firstVariantButton.dataset.variantComparePrice;

        if (comparePrice) {
          priceContainer.innerHTML = `
          <div class="product-card__pricing-container">
                 <div class="savings tw-text-red-600 tw-font-semibold md:tw-order-3 tw-order-1 tw-whitespace-nowrap tw-leading-tight">Save ${this.calculateSavings(price, comparePrice)}</div>
            <div class="original-price tw-text-stone-400 tw-txt-diagonal tw-mb-0 tw-order-2 tw-leading-tight tw-inline-block" data-compare-price>${comparePrice}</div>
           
     
                  </div>
             <div class="sale-price tw-font-bold md:tw-text-4xl tw-text-2xl tw-text-red-600 tw-relative md:tw-block tw-hidden" data-price>${price}</div>
             
    
          `;
        } else {
          priceContainer.innerHTML = `
            <div class="regular-price" data-price>${price}</div>
          `;
        }
      }
    });
  }

  bindEvents() {
    // 导航点击事件
    const navLinks = this.container.querySelectorAll('.bike-category');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(link);
      });
    });
    
    // 变体图片按钮点击事件
    const variantButtons = this.container.querySelectorAll('.variant-image-button');
    variantButtons.forEach(button => {
      button.addEventListener('click', () => this.handleVariantChange(button));
    });

    // 阅读更多按钮点击事件
    const readMoreBtns = this.container.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Removed preventDefault to allow normal link navigation
      });
    });
  }

  initializeImageHover() {
    const imageContainers = this.container.querySelectorAll('.product-card__image-container');
    imageContainers.forEach(container => {
      const mainImage = container.querySelector('.product-card__image-main');
      const hoverImage = container.querySelector('.product-card__image-hover');

      if (mainImage && hoverImage) {
        container.addEventListener('mouseenter', () => {
          mainImage.style.opacity = '0';
          hoverImage.style.opacity = '1';
        });

        container.addEventListener('mouseleave', () => {
          mainImage.style.opacity = '1';
          hoverImage.style.opacity = '0';
        });
      }
    });
  }

  handleNavClick(link) {
    // 移除所有active类
    this.container.querySelectorAll('.bike-category').forEach(el => {
      el.classList.remove('bike-category--active');
    });
    
    // 添加active类到当前点击的链接
    link.classList.add('bike-category--active');
  }

  handleVariantChange(button) {
    const productCard = button.closest('.product-card');
    const variantButtons = productCard.querySelectorAll('.variant-image-button');
    const mainImage = productCard.querySelector('.product-card__image-main');
    const hoverImage = productCard.querySelector('.product-card__image-hover');
    const priceContainer = productCard.querySelector('.product-card__pricing');

    // 更新按钮状态
    variantButtons.forEach(btn => btn.classList.remove('variant-image-button--active'));
    button.classList.add('variant-image-button--active');

    // 更新图片，添加过渡效果
    if (button.dataset.variantImage) {
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = button.dataset.variantImage;
        mainImage.alt = button.dataset.variantImageAlt;
        mainImage.style.opacity = '1';
      }, 300);
    }
    if (button.dataset.variantHoverImage) {
      hoverImage.style.opacity = '0';
      setTimeout(() => {
        hoverImage.src = button.dataset.variantHoverImage;
        hoverImage.alt = button.dataset.variantHoverImageAlt;
      }, 300);
    }

    // 更新价格，添加过渡效果
    const price = button.dataset.variantPrice;
    const comparePrice = button.dataset.variantComparePrice;

    priceContainer.style.opacity = '0';
    setTimeout(() => {
      if (comparePrice) {
        priceContainer.innerHTML = `
          <div class="original-price" data-compare-price>${comparePrice}</div>
             <div class="savings">Save ${this.calculateSavings(price, comparePrice)}</div>
          <div class="sale-price" data-price>${price}</div>
       
        `;
      } else {
        priceContainer.innerHTML = `
          <div class="regular-price" data-price>${price}</div>
        `;
      }
      priceContainer.style.opacity = '1';
    }, 300);
  }

  calculateSavings(price, comparePrice) {
    const priceNumber = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    const comparePriceNumber = parseFloat(comparePrice.replace(/[^0-9.-]+/g, ''));
    return `$${(comparePriceNumber - priceNumber).toFixed(2)}`;
  }

  filterProducts(category) {
    this.products.forEach(product => {
      if (category === 'all') {
        product.style.display = '';
        return;
      }

      const productCategory = product.dataset.category;
      product.style.display = productCategory === category ? '' : 'none';
    });

    // 添加动画效果
    const visibleProducts = Array.from(this.products).filter(p => p.style.display !== 'none');
    visibleProducts.forEach((product, index) => {
      product.style.animationDelay = `${index * 0.1}s`;
      product.classList.add('product-card--animate');
    });
  }

  // 辅助方法：添加产品过渡动画
  animateProducts() {
    this.products.forEach(product => {
      if (product.style.display !== 'none') {
        product.classList.add('product-card--animate');
      } else {
        product.classList.remove('product-card--animate');
      }
    });
  }

  // 初始化Judge.me评分显示
  initJudgemeReviews() {
    // 检查是否存在Judge.me全局对象
    if (window.jdgm && typeof window.jdgm.refreshBadges === 'function') {
      // 重新初始化所有Judge.me徽章
      window.jdgm.refreshBadges();
    } else {
      // 如果Judge.me尚未加载，等待加载完成后再初始化
      document.addEventListener('jdgm.ready', function() {
        if (typeof window.jdgm.refreshBadges === 'function') {
          window.jdgm.refreshBadges();
        }
      });
    }
  }
}

// 初始化所有自行车目录部分
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('[data-section-type="bike-catalog"]');
  sections.forEach(section => {
    new BikeCatalog(section);
  });
});
