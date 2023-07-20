import View from './View';
import icons from 'url:../../img/icons.svg';

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  errorMessage = `No bookmarks yet. Find a new recipe and bookmark it :)`;
  message = ``;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this.data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    return `
     <li class="preview">
      <a class="preview__link" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
        </div>
      </a>
    </li>
   `;
  }
}
export default new bookmarksView();
