export const SET_MOVIES = 'SET_MOVIES';
export const SET_FILTER = 'SET_FILTER';
export const SET_SORT_COLUMN = 'SET_SORT_COLUMN';
export const SET_USER = 'SET_USER';

export function setMovies(value) {
  return { type: SET_MOVIES, value };
}

export function setFilter(value) {
  return { type: SET_FILTER, value };
}

export function setSortColumn(value) {
  return { type: SET_SORT_COLUMN, value };
}

export function setUser(value) {
  return { type: SET_USER, value }
}
