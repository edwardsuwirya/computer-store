import { TokoKomputerPage } from './app.po';

describe('toko-komputer App', () => {
  let page: TokoKomputerPage;

  beforeEach(() => {
    page = new TokoKomputerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
