export default `<button id="{{id}}" class="button" type="{{type}}"
                    {{#if disabled}}
                        disabled
                    {{/if}}>
                    {{text}}
                </button>`