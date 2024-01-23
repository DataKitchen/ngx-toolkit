import { Observable, of } from 'rxjs';
import { TestScheduler } from './test-scheduler';

export class HttpClientMock {

  get = jest.fn().mockImplementation((args) => {
    console.log({ args });
    return of({});
  });


  expect<T>(observable: Observable<T>) {

    return {
      endpointHasBeenCalledWith: (endpoint: string, request?: any, response?: any) => {

        expect(this.get).toHaveBeenCalledWith(endpoint, expect.anything());

        if (request) {
          expect(this.get).toHaveBeenCalledWith(expect.anything(), request);
        }

        if (response) {
          TestScheduler.expect$(observable).toContain(response);
        }
      }
    };
  }
}

/**
 * example
 *
 *   it('should get all events', () => {
 *     httpClient.expect(service.getEvents({
 *       parentId: 'projectId'
 *     })).endpointHasBeenCalledWith('base/observability/v1/projects/projectId/events', expect.objectContaining({ parentId: 'projectId' }));
 *
 *
 *   });
 */
