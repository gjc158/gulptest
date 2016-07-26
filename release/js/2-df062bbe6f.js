console.info("2222");
(function(window){
	function test(){
		this.init();
	}
	
	test.prototype = {
		init: function(){
			console.info("11111");
		}
	};
	
	document.ready(function () {
        var page = new test();
    });
	
})(window);