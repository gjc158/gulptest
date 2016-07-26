void 0;
void 0;
void 0;
void 0;
(function(window){
	function test(){
		this.init();
	}
	
	test.prototype = {
		init: function(){
			void 0;
		}
	};
	
	document.ready(function () {
        var page = new test();
    });
	
})(window);