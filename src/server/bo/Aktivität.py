from server.bo.NamedBusinessObject import NamedBusinessObject as nbo


class Aktivität(nbo):

    def __init__(self):
        super().__init__()
        self._aktivität_id = ""
        self._bezeichnung = ""
        self._kapazität_in_personentagen = ""

    def set_aktivität_id(self, aktivität_id):
        self._aktivität_id = aktivität_id

    def get_aktivität_id(self):
        return self.set_aktivität_id()

    def set_bezeichnung(self, bezeichnung):
        self._bezeichnung = bezeichnung

    def get_bezeichnung(self):
        return self._bezeichnung

    def set_kapazität_in_personentagen(self, kapazität_in_personentagen):
        self._kapazität_in_personentagen = kapazität_in_personentagen

    def get_kapazität_in_personentagen(self):
        return self.__kapazität_in_personentagen


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Rating()."""
        obj = Aktivität()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_bezeichnung(dictionary["bezeichnung"])
        obj.set_kapazität_in_personentagen(dictionary["kapazität_in_personentagen"])


        return obj