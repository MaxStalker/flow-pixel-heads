import FungibleToken from 0xee82856bf20e2aa6

pub contract PixelatedPersonas{

    /// Event that is emitted, when new sprite layer is added to the database
    pub event PartAdded(type: String, id: Int)

    pub struct Offset{
        pub let x: UInt8
        pub let y: UInt8

        init(x: UInt8, y:UInt8){
            self.x = x
            self.y = y
        }
    }

    pub struct Part{
        pub let type: String
        pub let pixelData: [UInt8]
        pub let paletteIndex: Int

        init(_ type: String, _ pixelData: [UInt8], _ paletteIndex: Int){
            self.type = type
            self.pixelData = pixelData
            self.paletteIndex = paletteIndex
        }
    }

    pub struct Palette{
        pub let colors: [[UInt8]]
        pub let transaparentColor: [UInt8]?

        init(colors: [[UInt8]], transaparentColor: [UInt8]?){
            self.colors = colors
            self.transaparentColor = transaparentColor
        }
    }

    pub var heads : [Part]
    pub var hats: [Part]
    pub var palettes: [Palette]

    /// Heads logic
    pub fun addHead(pixelData: [UInt8], paletteIndex: Int){
        let type = "head"        
        let id = self.heads.length
        let part = Part(type, pixelData, paletteIndex)
        
        self.heads.append(part)

        emit PartAdded(type: type, id: id);        
    }


    /// Palettes

    pub fun registerPalette(palette: Palette, fee: FungibleToken.Vault): Int{
        let id = self.palettes.length
        self.palettes.append(palette)

        return id
    }


    /// ============================================================================================================================
    /// Getters
    /// ============================================================================================================================

    pub fun getHeadById(_ id: Int): Part?{
        return self.heads[id] 
    }

    // TODO: It's probably will be better to implement cursor and limiter here, but for now it will work just fine...
    pub fun getAvailableHeads(): [Part]{
        return self.heads
    }

    pub fun getPaletteById(_ id: Int): Palette? {
        return self.palettes[id]
    }

    pub fun getAvailablePalettes(): [Palette] {
        return self.palettes
    }

    /// ============================================================================================================================
    /// Init Contract with empty values
    /// ============================================================================================================================
    init(){
        log("Pixel Heads were established!")
        self.heads = []
        self.hats = []
        self.palettes = []
    }
}