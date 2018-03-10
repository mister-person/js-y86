var RegistersView = Backbone.View.extend({
	className: 'registers',

	initialize: function () {
		this.template = _.template($('#tmpl_registers').html());
		this.render();
	},

	render: function () {
		var registers = {
			rax_hex: '0x' + padHex(REG[0].toString(16), 16),
			rax_dec: (REG[0]).toString(10),
			rcx_hex: '0x' + padHex(REG[1].toString(16), 16),
			rcx_dec: (REG[1]).toString(10),
			rdx_hex: '0x' + padHex(REG[2].toString(16), 16),
			rdx_dec: (REG[2]).toString(10),
			rbx_hex: '0x' + padHex(REG[3].toString(16), 16),
			rbx_dec: (REG[3]).toString(10),
			rsp_hex: '0x' + padHex(REG[4].toString(16), 16),
			rsp_dec: (REG[4]).toString(10),
			rbp_hex: '0x' + padHex(REG[5].toString(16), 16),
			rbp_dec: (REG[5]).toString(10),
			rsi_hex: '0x' + padHex(REG[6].toString(16), 16),
			rsi_dec: (REG[6]).toString(10),
			rdi_hex: '0x' + padHex(REG[7].toString(16), 16),
			rdi_dec: (REG[7]).toString(10),
			r8x_hex: '0x' + padHex(REG[8].toString(16), 16),
			r8x_dec: (REG[8]).toString(10),
			r9x_hex: '0x' + padHex(REG[9].toString(16), 16),
			r9x_dec: (REG[9]).toString(10),
			r10x_hex: '0x' + padHex(REG[10].toString(16), 16),
			r10x_dec: (REG[10]).toString(10),
			r11x_hex: '0x' + padHex(REG[11].toString(16), 16),
			r11x_dec: (REG[11]).toString(10),
			r12x_hex: '0x' + padHex(REG[12].toString(16), 16),
			r12x_dec: (REG[12]).toString(10),
			r13x_hex: '0x' + padHex(REG[13].toString(16), 16),
			r13x_dec: (REG[13]).toString(10),
			r14x_hex: '0x' + padHex(REG[14].toString(16), 16),
			r14x_dec: (REG[14]).toString(10),

			sf: SF,
			zf: ZF,
			of: OF,
			stat: STAT,
			err: ERR,
			pc: '0x' + padHex(PC.toString(16), 4)
		};

		this.$el.empty().append(this.template(registers));
	}
});
