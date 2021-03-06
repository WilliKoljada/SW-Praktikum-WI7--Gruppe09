from server.bo import BusinessObject as bo


class ArbeitKonto(bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._urlaub = ""
        self._krankheit = ""
        self._arbeit = ""
        self._pause = ""

    def get_urlaub(self):
        return self._urlaub

    def set_urlaub(self, value):
        self._urlaub = value

    def get_krankheit(self):
        return self._krankheit

    def set_krankheit(self, value):
        self._krankheit = value

    def get_arbeit(self):
        return self._arbeit

    def set_arbeit(self, value):
        self._arbeit = value

    def get_pause(self):
        return self._pause

    def set_pause(self, value):
        self._pause = value


    @staticmethod
    def from_dict(dictionary=dict()):
        """Umwandeln eines Python dict() in ein Rating()."""
        obj = ArbeitKonto()
        obj.set_id(dictionary["id"])  # eigentlich Teil von BusinessObject !
        obj.set_creation_date(dictionary["creation_date"])
        obj.set_urlaub(dictionary["urlaub"])
        obj.set_krankheit(dictionary["krankheit"])
        obj.set_arbeit(dictionary["arbeit"])
        obj.set_pause(dictionary["pause"])

        return obj