from src.server.bo.BusinessObject import BusinessObject as bo


class Aktivitaet(bo):

    def __init__(self):
        super().__init__()
        self._bezeichnung = ""
        self._kapazitaet_in_personentagen = ""

    def set_bezeichnung(self, bezeichnung):
        self._bezeichnung = bezeichnung

    def get_bezeichnung(self):
        return self._bezeichnung

    def set_kapazitaet_in_personentagen(self, kapazitaet_in_personentagen):
        self._kapazitaet_in_personentagen = kapazitaet_in_personentagen

    def get_kapazitaet_in_personentagen(self):
        return self._kapazitaet_in_personentagen


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Rating()."""
        obj = Aktivitaet()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_creation_date(dictionary["creation_time"])
        obj.set_bezeichnung(dictionary["bezeichnung"])
        obj.set_kapazitaet_in_personentagen(dictionary["kapazitaet_in_personentagen"])


        return obj