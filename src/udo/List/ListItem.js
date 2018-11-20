enyo.kind({
	name: "udo.ListItem",
	events: {
		onActionTap: "",
		onTap: "",
		onholdpulse: "",
		onup: ""
	},
	ontap: "itemTap",
	onholdpulse: "holdpulse",
	onup: "up",
	components: [
		{name: "text", allowHtml: true, classes: "udo-list-item-text", style: "display: inline-block; white-space:nowrap; overflow: hidden; text-overflow: ellipsis;"},
		{ name: "actionButtons", classes: "udo-list-item-move-button" }
	],
        setActionButtons: function(actionButtons){
                for (var i=0;i<actionButtons.length;i++){
                        this.$.actionButtons.createComponent({
                                kind:"onyx.IconButton",
                                content: actionButtons[i].content,
//                                classes: this.actionButtons[i].classes + " onyx-contextual-popup-action-button",
                                name: actionButtons[i].name ? actionButtons[i].name : "ActionButton"+i,
                                index: i,
				allowHtml: actionButtons[i].allowHtml,
                                tap: actionButtons[i].ontap ? enyo.bind(this.owner, actionButtons[i].ontap) : enyo.bind(this, this.actionTap)
                        });
                }
        },
        itemTap: function(inSender, inEvent){
                this.doTap(inEvent);
                return true;
        },
        holdpulse: function(inSender, inEvent){
                this.doHoldpulse(inEvent);
                return true;
        },
	up: function(inSender,inEvent) {
                this.doUp(inEvent);
	},
        actionTap: function(inSender, inEvent){
                inEvent.actionButton = true;
                this.doActionTap(inEvent);
                return true;
        },
	setItem: function(data) {
		this.$.text.setContent(data.text);
	},
	setSelected: function(inSelected) {
		this.addRemoveClass("udo-list-item-selected", inSelected);
		this.$.actionButtons.applyStyle("display", inSelected ? "inline-block" : "gne");
	}
});
