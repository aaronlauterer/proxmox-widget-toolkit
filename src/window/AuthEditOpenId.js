Ext.define('Proxmox.panel.OpenIDInputPanel', {
    extend: 'Proxmox.panel.InputPanel',
    xtype: 'pmxAuthOpenIDPanel',
    mixins: ['Proxmox.Mixin.CBind'],

    type: 'openid',

    onGetValues: function(values) {
	let me = this;

	if (me.isCreate) {
	    values.type = me.type;
	}

	return values;
    },

    columnT: [
	{
	    xtype: 'textfield',
	    name: 'issuer-url',
	    fieldLabel: gettext('Issuer URL'),
	    allowBlank: false,
	},
    ],

    column1: [
	{
	    xtype: 'pmxDisplayEditField',
	    name: 'realm',
	    cbind: {
		value: '{realm}',
		editable: '{isCreate}',
	    },
	    fieldLabel: gettext('Realm'),
	    allowBlank: false,
	},
	{
	    xtype: 'proxmoxtextfield',
	    fieldLabel: gettext('Client ID'),
	    name: 'client-id',
	    allowBlank: false,
	},
	{
	    xtype: 'proxmoxtextfield',
	    fieldLabel: gettext('Client Key'),
	    cbind: {
		deleteEmpty: '{!isCreate}',
	    },
	    name: 'client-key',
	},
    ],

    column2: [
	{
	    xtype: 'proxmoxcheckbox',
	    fieldLabel: gettext('Autocreate Users'),
	    name: 'autocreate',
	    value: 0,
	    cbind: {
		deleteEmpty: '{!isCreate}',
	    },
	},
	{
	    xtype: 'pmxDisplayEditField',
	    name: 'username-claim',
	    fieldLabel: gettext('Username Claim'),
	    editConfig: {
		xtype: 'proxmoxKVComboBox',
		editable: true,
		comboItems: [
		    ['__default__', Proxmox.Utils.defaultText],
		    ['subject', 'subject'],
		    ['username', 'username'],
		    ['email', 'email'],
		],
	    },
	    cbind: {
		value: get => get('isCreate') ? '__default__' : Proxmox.Utils.defaultText,
		deleteEmpty: '{!isCreate}',
		editable: '{isCreate}',
	    },
	},
    ],

    columnB: [
	{
	    xtype: 'textfield',
	    name: 'comment',
	    fieldLabel: gettext('Comment'),
	    cbind: {
		deleteEmpty: '{!isCreate}',
	    },
	},
    ],
});

