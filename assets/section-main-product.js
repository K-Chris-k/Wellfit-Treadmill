
  function autoResponsive() {
  const width = document.body.clientWidth || window.innerWidth;
  
  if (width < 1025 && width >= 750) {
      const scale = width / 1023;
      const content = 'width=1023, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', viewport-fit=cover';
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
          metaViewport.setAttribute("content", content);
      }
  }
  
  if (width < 460) {
      const scale = width / 460;
      const content = 'width=460, initial-scale=' + scale + ', minimum-scale=' + scale + ', maximum-scale=' + scale + ', viewport-fit=cover';
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
          metaViewport.setAttribute("content", content);
      }
  }
}
autoResponsive();
document.addEventListener("DOMContentLoaded", function() {
  const tabItems = document.querySelectorAll('.switch_tabs .item-tab');
  const tabContents = document.querySelectorAll('.switch_tabs .item-content');

  tabItems.forEach(tabItem => {
    tabItem.addEventListener('click', function() {
      const tabNumber = this.getAttribute('data-tab');

      tabContents.forEach(tabContent => {
        tabContent.classList.add('tw-hidden');
      });

      const selectedTabContent = document.querySelector(`.switch_tabs .item-content[data-tab="${tabNumber}"]`);
      selectedTabContent.classList.remove('tw-hidden');

      tabItems.forEach(itemTab => {
        itemTab.classList.remove('active');
      });

      this.classList.add('active');
    });
  });

  function switchTab() {
    $(".tab-switch-wrapper .tabs-wrapper .tab").click(function() {
      const tabId = $(this).attr('tab-i');
      const contentWrap = $(this).closest('.tab-switch-wrapper').find('.tab-content[tab-i="' + tabId + '"]');
      contentWrap.siblings(".tab-content").fadeOut(150).promise().done(function() {
        contentWrap.fadeIn(150);
      });
      
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
    });
  }
  if($(".tab-switch-wrapper").length) switchTab();


  function handleScrollEvent() {
    const targetElements = $('.anm-bike-title');
    const windowHeight = $(window).height();
    let isScrolling = false;
    $(window).scroll(() => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          targetElements.each(function() {
            const elementOffset = $(this).offset().top;
            const scrollTop = $(window).scrollTop();
            if (scrollTop + windowHeight > elementOffset) {
              $(this).addClass('action');
            }
          });
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
  }
  handleScrollEvent();
 
  
});



$(function(){
    
    $(".video-pop-wrapper").on("click", ".close-js, .tw-mask", function(e) {
        $(this).closest(".video-pop-wrapper").fadeOut();
        // 暂停视频（包括iframe）
        var videoElement = $(this).closest(".video-pop-wrapper").find("video")[0];
        if (videoElement) {
          videoElement.pause();
        }
        var iframeElement = $(this).closest(".video-pop-wrapper").find("iframe")[0];
        if (iframeElement) {
          var iframeSrc = iframeElement.src;
          iframeElement.src = iframeSrc; // 重新设置iframe的src将其暂停
        }
    });

    $('.video-pop-js').click(function(e) {
        const popId = $(this).attr('pop-id');
        const videoWrap = $('.video-pop-wrapper[pop-id="' + popId + '"]');
        e.preventDefault();
        videoWrap.fadeIn();
        // 播放视频
        const videoElement = videoWrap.find('video')[0];
        if (videoElement && videoElement.paused) {
          videoElement.play();
        }
      
        const iframeElement = videoWrap.find('iframe')[0];
        if (iframeElement) {
          const iframeSrc = iframeElement.src;
          iframeElement.src = iframeSrc; // 重新设置iframe的src将其播放
        }
    });
    


})

$(function() {
    $(".video-pop-wrapper").on("click", ".close-js, .tw-mask", function(e) {
        $(this).closest(".video-pop-wrapper").fadeOut();
        var videoElement = $(this).closest(".video-pop-wrapper").find("video")[0];
        videoElement && videoElement.pause();
        var iframeElement = $(this).closest(".video-pop-wrapper").find("iframe")[0];
        if (iframeElement) {
            var iframeSrc = iframeElement.src;
            iframeElement.src = iframeSrc
        }
    }),
    $(".video-pop-js").click(function(e) {
        const popId = $(this).attr("pop-id")
          , videoWrap = $('.video-pop-wrapper[pop-id="' + popId + '"]');
        e.preventDefault(),
        videoWrap.fadeIn();
        const videoElement = videoWrap.find("video")[0];
        videoElement && videoElement.paused && videoElement.play();
        const iframeElement = videoWrap.find("iframe")[0];
        if (iframeElement) {
            const iframeSrc = iframeElement.src;
            iframeElement.src = iframeSrc
        }
    })
});


