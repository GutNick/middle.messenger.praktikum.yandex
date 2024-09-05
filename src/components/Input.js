export default `{{#if label}}
                    <label class="label {{class}}__label">
                    <span class="label-text {{class}}__label-text">{{label}}</span>
                {{/if}}
                      <input id="{{id}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}"
                             class="input {{class}}__input" name="{{name}}"
                             {{#if readonly}}
                                readonly
                            {{/if}}
                              >
                {{#if label}}
                    </label>
                {{/if}}`
