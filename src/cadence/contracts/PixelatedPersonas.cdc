import FlowToken from 0x01

pub contract PixelatedPersonas{

    /// Event that is emitted, when new sprite layer is added to the database
    pub event PartAdded(type: String, id: Int)
    pub event PaletteAdded(id: Int)


    pub struct Cursor{
        pub let start: Int
        pub let amount: Int

        init(start: Int, amount: Int){
            self.start = start
            self.amount = amount
        }
    }

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
        pub let supply: Int

        init(_ type: String, _ supply: Int, _ pixelData: [UInt8], _ paletteIndex: Int){
            self.type = type
            self.pixelData = pixelData
            self.paletteIndex = paletteIndex
            self.supply = supply
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

    /// This Vault will be used for staking and rewards distribution in the future.
    /// For now we just initialize it
    pub let creatorsVault: @FlowToken.Vault

    /// Generalized method for adding parts
    pub fun addPart(type: String, supply: Int, pixelData: [UInt8], paletteIndex: Int, feeVault: @FungibleToken.Vault): Int{

        var id = 0
        let part = Part(type, supply, pixelData, paletteIndex)
        
        switch type {
            case "head":
                id = self.heads.length
                self.heads.append(part)

            case "hats":
                id = self.hats.length
                self.hats.append(part)

            default:
                log("Thank you for depositing to Creators Vault")
        }
        
        self.creatorsVault.deposit(from: <- feeVault)

        emit PartAdded(type: type, id: id);        
        return id
    }

    /// Palettes
    pub fun registerPalette(palette: Palette, feeVault: @FungibleToken.Vault): Int{
        let id = self.palettes.length

        self.palettes.append(palette)
        self.creatorsVault.deposit(from: <- feeVault)

        emit PaletteAdded(id: id);  
        return id
    }


    /// ============================================================================================================================
    /// Getters
    /// ============================================================================================================================

    pub fun getHeadById(_ id: Int): Part?{
        return self.heads[id] 
    }

    pub fun getPaletteById(_ id: Int): Palette? {
        return self.palettes[id]
    }

    pub fun getAvailablePalettes(): [Palette] {
        return self.palettes
    }

    pub fun listAvailableParts(_ type: String): [Part?] {
        switch type {
            case "head":
                return self.heads

            case "hats":
                return self.hats

            default:
                return []        
        }
    }

    /// ============================================================================================================================
    /// Init Contract with empty values
    /// ============================================================================================================================
    init(){
        log("Pixel Heads were established!")
        self.heads = []
        self.hats = []
        self.palettes = []

        self.creatorsVault <- FlowToken.createEmptyVault()
    }
}
