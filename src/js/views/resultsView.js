import View from './View';
import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  errorMessage = `No recipes found for your query!`;
  message = `Start by searching for a recipe or an ingredient. Have fun!`;

  _generateMarkup() {
    console.log(this.data);
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
export default new resultsView();
