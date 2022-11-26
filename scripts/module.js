const moduleName = 'hide-item-value';
const defaultShowPriceSetting = 'defaultShowPrice'
const defaultAppraisedSetting = 'defaultAppraisedSetting'
const defaultRangeSetting = 'defaultRangeMinSetting'
const defaultRangeRndSetting = 'defaultRangeRndSetting'
const showPriceFlag = 'showPrice'
const appraisedFlag = 'appraised'
const defaultAppraisedFlag = 'defaultAppraised'

Hooks.on('init', () => {
  game.settings.register(moduleName, defaultShowPriceSetting, {
    name: 'Show price by default',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
})

const showAppraisedToPlayer = (html, appraised) => {
  const priceInput = $(html).find('input[name="system.price"]');
  priceInput.replaceWith(
    `<input type="text" name="flags.${moduleName}.${appraisedFlag}" value="${appraised}" data-dtype="String">`
  );
};

const addAppraisedControlsForGM = (html, appraised, showPrice) => {
  const priceInput = $(html).find('input[name="system.price"]');
  priceInput.closest('.form-group').after(
    `<div class="form-group">
      <label>Appraised</label>
      <input type="text" name="flags.${moduleName}.${appraisedFlag}" value="${appraised}" data-dtype="String">
    </div>
    <div class="form-group">
      <label>Show Price</label>
      <input type="checkbox" name="flags.${moduleName}.${showPriceFlag}" data-dtype="Boolean" ${
        showPrice ? 'checked' : ''
      } style="max-width:16px">
    </div>`
  );
};

const showHidePrice = async (app, html, data) => {
  const defaultShowPrice = await game.settings.get(moduleName, defaultShowPriceSetting)
  const showPrice = data.item.getFlag(moduleName, showPriceFlag) || defaultShowPrice;
  const appraised = data.item.getFlag(moduleName, appraisedFlag) || '';

  if (game.user.isGM) {
    addAppraisedControlsForGM(html, appraised, showPrice);
  } else if (!showPrice) {
    showAppraisedToPlayer(html, appraised);
  }
};

Hooks.on('renderItemSheet5e', showHidePrice);
Hooks.on('renderTidy5eItemSheet', showHidePrice);
