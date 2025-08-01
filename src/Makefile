include defines.mk

BIOME ?= proxmox-biome

SUBDIRS= css images proxmox-dark

# bundle it for now from the libjs-marked debian package to avoid touching our proxies file mapper,
# we could also just ship a link to the packages file and load from same path as the widget-toolkit
MARKEDJS=/usr/share/javascript/marked/marked.js

JSSRC=					\
	Utils.js			\
	Schema.js			\
	Toolkit.js			\
	Logo.js				\
	Parser.js			\
	mixin/CBind.js			\
	data/reader/JsonObject.js	\
	data/ProxmoxProxy.js		\
	data/UpdateStore.js		\
	data/DiffStore.js		\
	data/ObjectStore.js		\
	data/RRDStore.js		\
	data/TimezoneStore.js		\
	data/model/NotificationConfig.js	\
	data/model/Realm.js		\
	data/model/Certificates.js	\
	data/model/ACME.js		\
	form/BandwidthSelector.js	\
	form/DisplayEdit.js		\
	form/ExpireDate.js		\
	form/IntegerField.js		\
	form/TextField.js		\
	form/TextAreaField.js		\
	form/VlanField.js		\
	form/DateTimeField.js		\
	form/Checkbox.js		\
	form/KVComboBox.js		\
	form/LanguageSelector.js	\
	form/ComboGrid.js		\
	form/RRDTypeSelector.js		\
	form/BondModeSelector.js	\
	form/NetworkSelector.js		\
	form/RealmComboBox.js		\
	form/PruneKeepField.js		\
	form/RoleSelector.js		\
	form/DiskSelector.js		\
	form/MultiDiskSelector.js	\
	form/TaskTypeSelector.js	\
	form/ACME.js			\
	form/UserSelector.js		\
	form/ThemeSelector.js		\
	form/FingerprintField.js	\
	button/Button.js		\
	button/AltText.js		\
	button/HelpButton.js		\
	grid/ObjectGrid.js		\
	grid/PendingObjectGrid.js	\
	panel/AuthView.js		\
	panel/DiskList.js		\
	panel/EOLNotice.js		\
	panel/InputPanel.js		\
	panel/InfoWidget.js		\
	panel/LogView.js		\
	panel/NodeInfoRepoStatus.js	\
	panel/NotificationConfigView.js	\
	panel/JournalView.js		\
	panel/PermissionView.js		\
	panel/PruneKeepPanel.js		\
	panel/RRDChart.js		\
	panel/GaugeWidget.js		\
	panel/GotifyEditPanel.js	\
	panel/Certificates.js		\
	panel/ACMEAccount.js		\
	panel/ACMEPlugin.js		\
	panel/ACMEDomains.js		\
	panel/EmailRecipientPanel.js	\
	panel/SendmailEditPanel.js	\
	panel/SmtpEditPanel.js	\
	panel/StatusView.js		\
	panel/TfaView.js		\
	panel/NotesView.js		\
	panel/WebhookEditPanel.js	\
	window/Edit.js			\
	window/PasswordEdit.js		\
	window/SafeDestroy.js		\
	window/PackageVersions.js	\
	window/TaskViewer.js		\
	window/LanguageEdit.js		\
	window/DiskSmart.js		\
	window/ZFSDetail.js		\
	window/Certificates.js		\
	window/ConsentModal.js		\
	window/ACMEAccount.js		\
	window/ACMEPluginEdit.js	\
	window/ACMEDomains.js		\
	window/EndpointEditBase.js	\
	window/NotificationMatcherEdit.js \
	window/FileBrowser.js		\
	window/AuthEditBase.js		\
	window/AuthEditOpenId.js	\
	window/AuthEditLDAP.js		\
	window/AuthEditAD.js		\
	window/AuthEditSimple.js        \
	window/TfaWindow.js		\
	window/AddTfaRecovery.js	\
	window/AddTotp.js		\
	window/AddWebauthn.js		\
	window/AddYubico.js		\
	window/TfaEdit.js		\
	window/NotesEdit.js		\
	window/ThemeEdit.js		\
	window/SyncWindow.js	\
	node/APT.js			\
	node/APTRepositories.js		\
	node/NetworkEdit.js		\
	node/NetworkView.js		\
	node/DNSEdit.js			\
	node/HostsView.js		\
	node/DNSView.js			\
	node/Tasks.js			\
	node/ServiceView.js		\
	node/TimeEdit.js		\
	node/TimeView.js

all: $(SUBDIRS)
	set -e && for i in $(SUBDIRS); do $(MAKE) -C $$i; done

.lint-incremental: $(JSSRC)
	$(BIOME) lint $?
	touch "$@"

.PHONY: lint
check: lint
	$(BIOME) lint --error-on-warnings api-viewer/APIViewer.js
lint: $(JSSRC)
	$(BIOME) lint --error-on-warnings $(JSSRC)
	touch ".lint-incremental"

BUILD_TIME=$(or $(SOURCE_DATE_EPOCH),$(shell date '+%s.%N'))
BUILD_VERSION=$(or $(DEB_VERSION),$(shell git rev-parse HEAD),unknown version)
proxmoxlib.js: .lint-incremental $(JSSRC)
	# add the version as comment in the file
	echo "// v$(BUILD_VERSION)-t$(BUILD_TIME)" > $@.tmp
	cat $(JSSRC) $(MARKEDJS)  >> $@.tmp
	mv $@.tmp $@

proxmoxlib.min.js: proxmoxlib.js
	uglifyjs $< -c -m -o $@.tmp
	mv $@.tmp $@

install: proxmoxlib.js proxmoxlib.min.js
	install -d -m 755 $(WWWBASEDIR)
	install -m 0644 proxmoxlib.js proxmoxlib.min.js $(WWWBASEDIR)
	set -e && for i in $(SUBDIRS); do $(MAKE) -C $$i $@; done

.PHONY: clean
clean:
	$(MAKE) -C proxmox-dark $@
	rm -f proxmoxlib.js* proxmoxlib.min.js* .lint-incremental
