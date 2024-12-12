import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/complex">
        <Translate contentKey="global.menu.entities.propserviceComplex" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/property">
        <Translate contentKey="global.menu.entities.propserviceProperty" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/transaction">
        <Translate contentKey="global.menu.entities.propserviceTransaction" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-info">
        <Translate contentKey="global.menu.entities.userserviceUserInfo" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/report">
        <Translate contentKey="global.menu.entities.reportserviceReport" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/infrastructure">
        <Translate contentKey="global.menu.entities.reportserviceInfrastructure" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/env-factor">
        <Translate contentKey="global.menu.entities.reportserviceEnvFactor" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/living-room">
        <Translate contentKey="global.menu.entities.reportserviceLivingRoom" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/bedroom">
        <Translate contentKey="global.menu.entities.reportserviceBedroom" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/kitchen">
        <Translate contentKey="global.menu.entities.reportserviceKitchen" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/bathroom">
        <Translate contentKey="global.menu.entities.reportserviceBathroom" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/entrance">
        <Translate contentKey="global.menu.entities.reportserviceEntrance" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/author">
        <Translate contentKey="global.menu.entities.reportserviceAuthor" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/attach-file">
        <Translate contentKey="global.menu.entities.commonserviceAttachFile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/noti-template">
        <Translate contentKey="global.menu.entities.commonserviceNotiTemplate" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/noti-tpl-variable">
        <Translate contentKey="global.menu.entities.commonserviceNotiTplVariable" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/noti-send">
        <Translate contentKey="global.menu.entities.commonserviceNotiSend" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/noti-send-target">
        <Translate contentKey="global.menu.entities.commonserviceNotiSendTarget" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/noti-send-job">
        <Translate contentKey="global.menu.entities.commonserviceNotiSendJob" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
