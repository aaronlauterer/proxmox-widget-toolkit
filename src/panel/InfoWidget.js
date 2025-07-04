Ext.define('Proxmox.widget.Info', {
    extend: 'Ext.container.Container',
    alias: 'widget.pmxInfoWidget',

    layout: {
        type: 'vbox',
        align: 'stretch',
    },

    value: 0,
    maximum: 1,
    printBar: true,
    items: [
        {
            xtype: 'component',
            itemId: 'label',
            data: {
                title: '',
                usage: '',
                iconCls: undefined,
            },
            tpl: [
                '<div class="left-aligned">',
                '<tpl if="iconCls">',
                '<i class="{iconCls}"></i> ',
                '</tpl>',
                '{title}</div>&nbsp;<div class="right-aligned">{usage}</div>',
            ],
        },
        {
            height: 2,
            border: 0,
        },
        {
            xtype: 'progressbar',
            itemId: 'progress',
            height: 5,
            value: 0,
            animate: true,
        },
    ],

    warningThreshold: 0.75,
    criticalThreshold: 0.9,

    setPrintBar: function (enable) {
        var me = this;
        me.printBar = enable;
        me.getComponent('progress').setVisible(enable);
    },

    setIconCls: function (iconCls) {
        var me = this;
        me.getComponent('label').data.iconCls = iconCls;
    },

    setData: function (data) {
        this.updateValue(data.text, data.usage);
    },

    updateValue: function (text, usage) {
        let me = this;

        if (me.lastText === text && me.lastUsage === usage) {
            return;
        }
        me.lastText = text;
        me.lastUsage = usage;

        var label = me.getComponent('label');
        label.update(Ext.apply(label.data, { title: me.title, usage: text }));

        if (usage !== undefined && me.printBar && Ext.isNumeric(usage) && usage >= 0) {
            let progressBar = me.getComponent('progress');
            progressBar.updateProgress(usage, '');
            if (usage > me.criticalThreshold) {
                progressBar.removeCls('warning');
                progressBar.addCls('critical');
            } else if (usage > me.warningThreshold) {
                progressBar.removeCls('critical');
                progressBar.addCls('warning');
            } else {
                progressBar.removeCls('warning');
                progressBar.removeCls('critical');
            }
        }
    },

    initComponent: function () {
        var me = this;

        if (!me.title) {
            throw 'no title defined';
        }

        me.callParent();

        me.getComponent('progress').setVisible(me.printBar);

        me.updateValue(me.text, me.value);
        me.setIconCls(me.iconCls);
    },
});
