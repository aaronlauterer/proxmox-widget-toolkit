/* Key-Value ComboBox
 *
 * config properties:
 * comboItems: an array of Key - Value pairs
 * deleteEmpty: if set to true (default), an empty value received from the
 * comboBox will reset the property to its default value
 */
Ext.define('Proxmox.form.KVComboBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.proxmoxKVComboBox',

    config: {
        deleteEmpty: true,
    },

    comboItems: undefined,
    displayField: 'value',
    valueField: 'key',
    queryMode: 'local',

    // override framework function to implement deleteEmpty behaviour
    getSubmitData: function () {
        let me = this,
            data = null,
            val;
        if (!me.disabled && me.submitValue) {
            val = me.getSubmitValue();
            if (val !== null && val !== '' && val !== '__default__') {
                data = {};
                data[me.getName()] = val;
            } else if (me.getDeleteEmpty()) {
                data = {};
                data.delete = me.getName();
            }
        }
        return data;
    },

    validator: function (val) {
        let me = this;

        if (me.editable || val === null || val === '') {
            return true;
        }

        if (me.store.getCount() > 0) {
            let values = me.multiSelect ? val.split(me.delimiter) : [val];
            let items = me.store.getData().collect('value', 'data');
            if (
                Ext.Array.every(values, function (value) {
                    return Ext.Array.contains(items, value);
                })
            ) {
                return true;
            }
        }

        // returns a boolean or string
        return "value '" + val + "' not allowed!";
    },

    initComponent: function () {
        let me = this;

        me.store = Ext.create('Ext.data.ArrayStore', {
            model: 'KeyValue',
            data: me.comboItems,
        });

        if (me.initialConfig.editable === undefined) {
            me.editable = false;
        }

        me.callParent();
    },

    setComboItems: function (items) {
        let me = this;

        me.getStore().setData(items);
    },
});
