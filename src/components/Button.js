export default `<button id="{{id}}" class="button {{class}}" type="{{type}}"
                    {{#if disabled}}
                        disabled
                    {{/if}}>
                    {{text}}
                </button>`