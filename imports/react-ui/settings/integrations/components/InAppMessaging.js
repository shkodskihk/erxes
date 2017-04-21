import Common from './Common';

class InAppMessaging extends Common {
  static getInstallCode(brandCode) {
    return `
      <script>
        window.erxesSettings = {
          brand_id: "${brandCode}"
        };
        ${InAppMessaging.installCodeIncludeScript('inApp')}
      </script>
    `;
  }
}

export default InAppMessaging;