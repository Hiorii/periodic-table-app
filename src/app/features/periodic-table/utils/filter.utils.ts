import { PeriodicElement } from '../../../core/models/periodic-element.model';

export function filterPeriodicData(elements: PeriodicElement[], filterValue: string): PeriodicElement[] {
  if (!filterValue) return elements;

  const lowerCaseFilter = filterValue.toLowerCase();
  return elements.filter((element) => Object.values(element).some((val) => val.toString().toLowerCase().includes(lowerCaseFilter)));
}
