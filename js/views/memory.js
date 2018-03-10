var MemoryView = Backbone.View.extend({
	template: _.template($('#tmpl_memory').html()),

	initialize: function (options) {
		this.$words = [];
		this.numRendered = 0;

		$(window).on('resize', this.resize.bind(this));

		this.listenTo(Backbone.Events, 'app:redraw', this.updateStackPointers);

		this.render();
	},

	render: function () {
		this.$el.empty().append(this.template());
		this.$rsp = this.$('.rsp');
		this.$wordContainerWrapper = this.$('.mem-words-wrapper');
		this.$wordContainer = this.$('.mem-words');
		this.$wordContainer.on('scroll', this.autoload.bind(this));
		setTimeout(function () {
			// Load as many words as we need to fill the screen, and then some.
			var windowHeight = $(window).height();
			while (this.numRendered / 4 * 15 < windowHeight)
				this.render64();

			this.resize();

			// Widen the memory panel if there's a scroll bar.
			var width = 386 - this.$('.stack-pointers').width()
			this.$el.width(width);
			this.$el.parent().width(width);
		}.bind(this), 0);
	},

	render64: function () {
		var $word;
		var idx = this.numRendered;

		for (var i = 0; i < 64; i++) {
			$word = new MemWordView({ index: idx });
			this.$words.push($word);
			this.$wordContainer.append($word.$el);
			idx += 8;
		}

		this.numRendered = idx;
	},

	resize: function () {
		this.$wordContainerWrapper.height(
			$(window).height() - this.$wordContainerWrapper.position().top);
	},

	autoload: function (evt) {
		var scrollTop = this.$wordContainer.scrollTop();
		var height = this.$wordContainer.height();
		var scrollHeight = this.$wordContainer.get(0).scrollHeight;
		if (this.numRendered < MEM_SIZE && (scrollHeight <= height + scrollTop))
			this.render64();
	},

	updateStackPointers: function () {
		var rsp = REG[4].low / 8 * 15;
		console.log("usp " + rsp);
		var old_rsp = this.$rsp.position().top;
		rsp_changed = false;

		if (rsp !== old_rsp && (rsp_changed = true))
			this.$rsp.css('top', rsp + 'px');
		
		if (rsp_changed) {
			var containerHeight = this.$wordContainer.height();
			var scrollTop = this.$wordContainer.scrollTop();
			var newScroll = null;

			var max = rsp;
			if (max > scrollTop + containerHeight - 15)
				newScroll = max - containerHeight + 55;

			// Load more memory if needed to show the stack pointers.
			while (this.numRendered < MEM_SIZE && this.numRendered < max / 15 * 8 + 4)
				this.render64();

			// Prefer scrolling to the higher of the two possible changed
			// values, if necessary.
			var min = rsp;
			if (min < scrollTop + 15)
				newScroll = min - 40;

			if (newScroll !== null)
				this.$wordContainer.scrollTop(newScroll);
		}
	}
});

var MemWordView = Backbone.View.extend({
	className: 'word',

	initialize: function (options) {
		this.index = options.index;
		this.listenTo(Backbone.Events, 'app:redraw', this.update);
		this.render();
	},

	render: function () {
		var value = this.getValue();
		var address_str = padHex(this.index, 4);
		var value_str = padHex(value.toString(16), 16);

		// Template is too slow. Create the nodes manually.
		var frag = document.createDocumentFragment();
		var $address = document.createElement('div');
		$address.className = 'address';
		$address.textContent = address_str;
		var $value = document.createElement('div');
		$value.className = 'value';
		$value.textContent = value_str;
		frag.appendChild($address);
		frag.appendChild($value);
		this.$el[0].appendChild(frag);

		this.lastValue = value;
	},

	getValue: function () {
		var bytes = [MEMORY[this.index], MEMORY[this.index + 1], MEMORY[this.index + 2], MEMORY[this.index + 3], MEMORY[this.index + 4], MEMORY[this.index + 5], MEMORY[this.index + 6], MEMORY[this.index + 7]];
		return new UInt64(((bytes[0] << 56) | (bytes[1] << 48) | (bytes[2] << 40) | (bytes[3] << 32)) >>> 0, ((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | (bytes[7] << 0)) >>> 0);
	},

	update: function () {
		var newValue = this.getValue();
		if (this.lastValue !== newValue) {
			this.lastValue = newValue;
			this.$('.value').text(padHex(newValue, 16));
		}
	}
});
