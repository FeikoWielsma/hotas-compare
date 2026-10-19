# Thrustmaster control inventory follow-up

> Research trail: consult [the integration review](controls-integration-review.md) and [current catalog audit](../control-data-audit.md) for subsequent corrections and current schema capabilities.

Checked 2026-10-19. Counts below refer to the named standalone variants, not bundled add-ons. Claims are paraphrased from first-party documentation.

| Product | Verified inventory and unresolved details | Coverage |
|---|---|---|
| TCA Yoke Boeing Edition (4460209) | The [user manual](https://ts.thrustmaster.com/download/accessories/Manuals/TCA_Yoke_Boeing/TCA_Yoke_Boeing_Edition_user_manual.pdf) identifies 18 action buttons, one 8-way POV hat, a mini-stick with button, and two throttle axes. The 18 buttons are not split into trigger/button/location subcounts; its landing gear and Xbox controls also need a finer physical breakdown. No trigger subtype inferred. | Partial |
| TPR PENDUL_R Rudder | The [manual](https://ts.thrustmaster.com/download/accessories/Manuals/TPR/TPR_Rudder_User_Manual.pdf) identifies a rudder axis and two differential-brake axes, supports independent dead-zone adjustment, and diagrams two pedals with no discrete controls. Three pedal axes are the complete physical input inventory. Schema has no pedal-axis control subtype, so the controls list uses rocker and brake-lever representations; this is a schema mismatch, not a claim of hand-operated controls. | Complete |
| TWCS Throttle | The [official PC mapping sheet](https://ts.thrustmaster.com/download/pictures/PCMAC/TWCS/TWCS_PC_Generic_Mapping.pdf) diagrams a POV 8-way hat, two 4-way hats, ministick X/Y plus momentary push, throttle Z axis, rudder rocker axis, antenna slider axis, and button IDs 1-14. The button IDs 7-14 are the directional contacts of the two hats, so they are not counted again as standalone buttons; five ordinary push buttons plus the separately represented momentary ministick push. Mapping provides no detent detail. | Complete |
| Viper Mission Pack BAP Panel | The [official product page](https://www.thrustmaster.com/products/viper-panel/) names 43 action-button events including 11 virtual buttons, one trim wheel axis, MODE/PGRM selectors, and multiple switches including weapon launch. The [Mission Pack manual mapping](https://ts.thrustmaster.com/download/accessories/Manuals/Viper/Viper_Mission_Pack_User_Manual.pdf), visually inspected on its mode-A diagram, distinguishes 32 physical button events and one axis from virtual events; it depicts four square pushbuttons among the panel controls. It does not fully classify all mapped events into discrete buttons, selectors, and switch types or establish exact positions/latching for all switches. Existing hardware axes now records the documented trim-wheel axis. | Partial |

## Schema limitation

The controls schema has no general pedal-axis subtype, so the TPR rudder and differential-brake axes are approximated by existing rocker and lever categories. The BAP diagram enumerates button events but not a dependable semantic type for all of them; counts are deliberately limited to controls directly identifiable by form and first-party description.
