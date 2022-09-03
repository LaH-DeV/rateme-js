export const createStyle = (id: string, styles?: string) => {
    const style = styles ?? `.rateme-element{--icon-active: #fece3c;--icon-inactive: #e6e6e6;--icon-cancel: rgba(232, 66, 27, 0.84);--icon-size: 20px;width:fit-content}.rateme-element .rateme-wrapper{display:flex;gap:5px;width:fit-content}.rateme-element .rateme-wrapper .rateme-rating{display:flex;width:fit-content;position:relative}.rateme-element .rateme-wrapper .rateme-rating:hover .rateme-icon.rateme-equal-zero-score{opacity:1;fill:var(--icon-cancel)}.rateme-element .rateme-wrapper .rateme-icon{transition:fill 150ms ease-in-out;fill:var(--icon-inactive)}.rateme-element .rateme-wrapper .rateme-icon.rateme-half-score:not(.rateme-above-zero-score):not(.rateme-equal-zero-score){fill:url(#rateme-gradient)}.rateme-element .rateme-wrapper .rateme-icon.rateme-full-score:not(.rateme-above-zero-score):not(.rateme-equal-zero-score){fill:var(--icon-active)}.rateme-element .rateme-wrapper .rateme-icon.rateme-equal-zero-score{opacity:.2;transition:all 150ms}.rateme-element .rateme-wrapper .rateme-icon.rateme-above-zero-score{transition:all 150ms;opacity:.5;fill:var(--icon-cancel)}.rateme-element .rateme-wrapper .rateme-icon.rateme-above-zero-score~.rateme-part,.rateme-element .rateme-wrapper .rateme-icon.rateme-equal-zero-score~.rateme-part{width:100%;left:0}.rateme-element .rateme-wrapper .rateme-part{position:absolute;top:0;height:100%;width:50%;cursor:pointer}.rateme-element .rateme-wrapper .rateme-part.rateme-full{right:0}.rateme-element .rateme-wrapper .rateme-part.rateme-half{left:0}.rateme-element .rateme-wrapper input[type=hidden]~.rateme-rating{cursor:pointer}.rateme-element[data-rm-animations=true] .rateme-icon.rateme-full-score{animation:stretch-bounce .5s ease-in-out}@keyframes stretch-bounce{0%{transform:scale(1)}25%{transform:scale(1.1)}50%{transform:scale(0.9)}75%{transform:scale(1.1)}100%{transform:scale(1)}}`;
    const styleTag = document.createElement("style");
    styleTag.setAttribute("rel", "stylesheet");
    styleTag.setAttribute("id", id);
    styleTag.textContent = style;
    return styleTag;
}
