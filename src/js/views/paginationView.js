import View from './View';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const paginationBtn = e.target.closest('.btn--inline');
      console.log(paginationBtn);
      if (!paginationBtn) return;
      const goToPage = +paginationBtn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage
    );
    console.log(numPages);
    // Page 1 and there are other pages
    if (this.data.page === 1 && numPages > 1) {
      return `
      <button data-goto="${
        this.data.page + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this.data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
    }
    // On the last page
    if (this.data.page === numPages) {
      return ` 
       <button data-goto="${
         this.data.page - 1
       }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this.data.page - 1}</span>
       </button>`;
    }
    // Other page
    if (this.data.page < numPages) {
      return `
       <button data-goto="${
         this.data.page - 1
       }" class="btn--inline pagination__btn--prev">
         <svg class="search__icon">
           <use href="${icons}#icon-arrow-left"></use>
         </svg>
         <span>Page ${this.data.page - 1}</span>
       </button>

       <button data-goto="${
         this.data.page + 1
       }" class="btn--inline pagination__btn--next">
        <span>Page ${this.data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
       </button>
      `;
    }
    // Page 1 and there are no other pages
    return ``;
  }
}

export default new paginationView();
