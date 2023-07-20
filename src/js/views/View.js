import icons from 'url:../../img/icons.svg';

//Parent class to other child views such as resultsView or recipeView
//refactoring some of the repeated code in this class (parent)
export default class View {
  data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (i.e. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @param {undefined | string} A markup string is returned if render = false
   * @this {Object} View instance
   * @author Kathy Toufighi
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.data = data;
    const markup = this._generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentElement.innerHTML = '';
  }

  //Spinner
  renderSpinner() {
    const markup = `
     <div class="spinner">
       <svg>
         <use href="${icons}#icon-loader"></use>
       </svg>
     </div>
   `;
    //clear parent element
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //render error in view
  renderError(message = this.errorMessage) {
    const markup = `
     <div class="error">
       <div>
         <svg>
           <use href="${icons}#icon-alert-triangle"></use>
         </svg>
       </div>
       <p>${message}</p>
     </div>`;
    //clear parent element
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //render message in view
  renderMessage(message = this.message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    //clear parent element
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
