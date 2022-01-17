const images = 8;
const weather_icon = {
	"qing": "☀",
	"yun": "🌤",
	"yin": "☁",
	"yu": "🌧️",
	"wu": "🌫",
	"lei": "🌩️",
	"shachen": "🌪",
	"xue": "🌨️",
	"bingbao": "💧"
}

// motto随机展示
// const mottos = [
// 	"永远相信美好的事情即将发生",
// 	"不负热爱，共赴山海！",
// 	"一如既往，万事胜意"
// ]
// $("#motto").text(mottos[Math.round(Math.random() * 1000) % (mottos.length)])

var iUp = (function () {
	var t = 0,
		d = 150,
		clean = function () {
			t = 0;
		},
		up = function (e) {
			setTimeout(function () {
				$(e).addClass("up")
			}, t);
			t += d;
		},
		down = function (e) {
			$(e).removeClass("up");
		},
		toggle = function (e) {
			setTimeout(function () {
				$(e).toggleClass("up")
			}, t);
			t += d;
		}
		;
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	}
})();

function getBingImages(imgUrls) {
	/**
	 * 获取Bing壁纸
	 * 先使用 GitHub Action 每天获取 Bing 壁纸 URL 并更新 images.json 文件
	 * 然后读取 images.json 文件中的数据
	 */
	var indexName = "bing-image-index";
	var index = sessionStorage.getItem(indexName);
	var $panel = $('#panel');
	if (isNaN(index)) { index = Math.round(Math.random() * 100) % 8; }
	else if (index == images - 1) index = 0;
	else index++;
	console.log(index, imgUrls[index], imgUrls.length)
	var imgUrl = imgUrls[index];
	var url = "https://www.bing.com" + imgUrl;
	$panel.css("background", "url('" + url + "') center center no-repeat #666");
	$panel.css("background-size", "cover");
	sessionStorage.setItem(indexName, index);
}

$(document).ready(function () {

	let t = Number(sessionStorage.getItem("weather-update")), result;
	console.log((Number(new Date()) - t) / 1000)
	try {
		if (Number(new Date()) - t > 1800000) {
			$.post("https://yiketianqi.com/api?version=v6&appid=52921577&appsecret=g4B0LrhP", function (result) {
				// result = $.parseJSON(result)
				console.log(result);
				sessionStorage.setItem("weather-update", Number(new Date()));
				sessionStorage.setItem("weather-data", result);
			})
		}
		result = sessionStorage.getItem("weather-data");
		$("#weather-city").text(result["city"])
		$("#weather-temp").text(result["tem"] + "℃")
		$("#weather-icon").text(weather_icon[result["wea_img"]])
		$(".weather").attr("title", "更新时间:" + result["update_time"])
	} catch (e) {
		console.log(e)
	}

	// 获取一言数据
	fetch('https://v1.hitokoto.cn').then(function (res) {
		return res.json();
	}).then(function (e) {
		$('#description').html(e.hitokoto + "<br/> -「<strong>" + e.from + "</strong>」")
	}).catch(function (err) {
		console.error(err);
	})

	setTimeout(
		function () {
			$(".iUp").each(function (i, e) {
				iUp.up(e);
			});

			$(".js-avatar")[0].onload = function () {
				$(".js-avatar").addClass("show");
			}

			setTimeout('$("#weather").show()', 1000);
		}, 250);
});

$('.btn-mobile-menu__icon').click(function () {
	if ($('.navigation-wrapper').css('display') == "block") {
		$('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
			$('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
		});
		$('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

	} else {
		$('.navigation-wrapper').toggleClass('visible animated bounceInDown');
	}
	$('.btn-mobile-menu__icon').toggleClass('social iconfont icon-list social iconfont icon-angleup animated fadeIn');
});
