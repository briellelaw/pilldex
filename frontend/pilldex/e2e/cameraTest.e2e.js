describe('Screen Navigation Tests', () => {

  it ('Login with user', async () => {

    const email = element(by.id('Email-Input-Login'));
    const pw = element(by.id('Password-Input-Login'));

    await email.replaceText('motmeep@gmail.com');
    await pw.replaceText('motmeep');

    await element(by.text("SIGN IN")).tap();
    await waitFor(element(by.text("My Pilldex"))).toBeVisible().withTimeout(20000);
  });

  it ('Launches the Camera module', async () => {
    const now = Date.now();
    await element(by.text("NEW PILL")).tap();
    await waitFor(element(by.text("CONFIRM"))).toBeVisible();
    const cam = Date.now();

    if ((cam - now) > 3000)
      console.error("Camera took too long to launch");
    else {
      console.log("Passed Camera Test");
    }
  });

});